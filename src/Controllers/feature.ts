import generate from "@babel/generator";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import * as fs from "fs";
import { createActionsTemplate, createConstantsTemplate, createHookActionTemplate, createInitialStateTemplate, createReducerTemplate } from "../templates";
import { toCamelCase, toPascalCase, toUnderScore } from "./../helpers/namingConventions";
import Redux from "./redux";

type FeatureProps = {
  feature: string;
};
const initiateFeature = ({ feature }: FeatureProps) => {
  const featureDir = `./redux/${feature}`;
  fs.mkdirSync(featureDir);
  fs.writeFileSync(`${featureDir}/actions.ts`, createActionsTemplate());
  fs.writeFileSync(`${featureDir}/constants.ts`, createConstantsTemplate());
  fs.writeFileSync(
    `${featureDir}/initialState.ts`,
    createInitialStateTemplate({ feature })
  );

  // Hook Creating useFeature Hook
  const useFeature = toCamelCase("use_" + feature);
  fs.writeFileSync(
    `./redux/hooks/${useFeature}.ts`,
    createHookActionTemplate({ feature })
  );
  // Hook, updating exports on hooks/index.ts
  const HooksIndexCode = fs.readFileSync(`./redux/hooks/index.ts`, "utf8");
  const HooksIndexAst = parser.parse(HooksIndexCode, {
    sourceType: "module",
    plugins: ["typescript", "exportDefaultFrom"]
  });
  HooksIndexAst.program.body.unshift(
    t.exportNamedDeclaration(
      null,
      [t.exportSpecifier(t.identifier("default"), t.identifier(useFeature))],
      t.stringLiteral(`./${useFeature}`)
    )
  );
  fs.writeFileSync(`./redux/hooks/index.ts`, generate(HooksIndexAst).code);

  // creating feature reducer.
  fs.writeFileSync(
    `${featureDir}/reducer.ts`,
    createReducerTemplate({ feature })
  );

  // Updating rootReducer
  Redux.updateRootReducer({ feature });
};

type ActionProps = {
  feature: string;
  name: string;
};

const updateInitialState = ({ feature, name }: ActionProps) => {
  const initialeStateCode = fs.readFileSync(
    `./redux/${feature}/initialState.ts`,
    "utf8"
  );
  const actionName = toCamelCase(name);
  const initialStateAst = parser.parse(initialeStateCode, {
    sourceType: "module",
    plugins: ["typescript", "exportDefaultFrom"]
  });

  traverse(initialStateAst, {
    enter(path) {
      // Update InitialState with actionNamePending: false
      if (
        t.isObjectExpression(path) &&
        t.isVariableDeclarator(path.parentPath)
      ) {
        // @ts-ignore
        path.node.properties.push(
          t.objectProperty(
            t.identifier(`${actionName}Pending`),
            t.booleanLiteral(false)
          )
        );
      }

      // Update InitialState Feature type with actionNamePending: boolean
      if (t.isTSTypeLiteral(path)) {
        //@ts-ignore
        path.node.members.push(
          t.tsPropertySignature(
            t.identifier(`${actionName}Pending`),
            t.tsTypeAnnotation(t.tsBooleanKeyword())
          )
        );
      }
    }
  });
  fs.writeFileSync(
    `./redux/${feature}/initialState.ts`,
    generate(initialStateAst).code
  );
};

const updateActions = ({ feature, name }: ActionProps) => {
  const actionName = toCamelCase(name);
  const ActionsCode = fs.readFileSync(`./redux/${feature}/actions.ts`, "utf8");
  const ActionsAst = parser.parse(ActionsCode, {
    sourceType: "module",
    plugins: ["typescript", "exportDefaultFrom"]
  });
  ActionsAst.program.body.unshift(
    t.exportNamedDeclaration(
      null,
      [t.exportSpecifier(t.identifier(actionName), t.identifier(actionName))],
      t.stringLiteral(`./${actionName}`)
    )
  );
  fs.writeFileSync(`./redux/${feature}/actions.ts`, generate(ActionsAst).code);
};

const updateConstants = ({ feature, name }: ActionProps) => {
  const constantsCode = fs.readFileSync(
    `./redux/${feature}/constants.ts`,
    "utf8"
  );
  const constantAst = parser.parse(constantsCode, {
    sourceType: "module"
  });
  const CONSTANT_ACTION = toUnderScore(feature + toPascalCase(name));
  const constantCode = `export const ${CONSTANT_ACTION} = "${CONSTANT_ACTION}" `;
  constantAst.program.body.push(
    ...parser.parse(constantCode, { sourceType: "module" }).program.body
  );
  fs.writeFileSync(
    `./redux/${feature}/constants.ts`,
    generate(constantAst).code
  );
};

const updateReducer = ({ feature, name }: ActionProps) => {
  const actionName = toCamelCase(name);
  const reducerCode = fs.readFileSync(`./redux/${feature}/reducer.ts`, "utf8");
  const reducerAst = parser.parse(reducerCode, {
    sourceType: "module",
    plugins: ["typescript", "exportDefaultFrom"]
  });

  // Updating Imports
  const ACTION_REDUCER_IMPORT = t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier(`${actionName}Reducer`),
        t.identifier("reducer")
      )
    ],
    t.stringLiteral(`./${actionName}`)
  );
  const ACTION_TYPE_IMPORT = t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier(`${toPascalCase(actionName)}Action`),
        t.identifier(`${toPascalCase(actionName)}Action`)
      )
    ],
    t.stringLiteral(`./${actionName}`)
  );
  reducerAst.program.body = [
    ACTION_REDUCER_IMPORT,
    ACTION_TYPE_IMPORT,
    ...reducerAst.program.body
  ];

  // Updating Type and Reducers
  const ACTIONS_TYPE_IDENTIFIER = `${toPascalCase(feature)}Actions`;
  const GENERIC_TYPE_IDENTIFIER = `${toPascalCase(actionName)}Action`;
  traverse(reducerAst, {
    enter(path) {
      // Updating Type
      if (
        path.isIdentifier({ name: ACTIONS_TYPE_IDENTIFIER }) &&
        path.parentPath.parentPath.isDeclaration()
      ) {
        //@ts-ignore
        if (t.isTSNullKeyword(path.parent.typeAnnotation)) {
          const node = t.tsTypeReference(t.identifier(GENERIC_TYPE_IDENTIFIER));
          //@ts-ignore
          path.parent.typeAnnotation = node;
          //@ts-ignore
        } else if (t.isTSTypeReference(path.parent.typeAnnotation)) {
          const oldNode = t.tsTypeReference(
            //@ts-ignore
            path.parent.typeAnnotation.typeName
          );
          const node = t.tsTypeReference(t.identifier(GENERIC_TYPE_IDENTIFIER));
          const newType = t.tsIntersectionType([oldNode, node]);
          //@ts-ignore
          path.parent.typeAnnotation = newType;
        } else {
          const node = t.tsTypeReference(t.identifier(GENERIC_TYPE_IDENTIFIER));
          //@ts-ignore
          path.parent.typeAnnotation.types.push(node);
        }
      }
      // Updating Reducers
      if (path.isArrayExpression()) {
        path.node.elements.push(t.identifier(`${actionName}Reducer`));
      }
    }
  });

  fs.writeFileSync(`./redux/${feature}/reducer.ts`, generate(reducerAst).code);
};

export default {
  initiate: initiateFeature,
  updateActions,
  updateReducer,
  updateConstants,
  updateInitialState
};
