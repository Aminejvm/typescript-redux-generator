import * as fs from "fs";
import { createAsyncActionTemplate, createSyncActionTemplate } from "../templates";
import { toCamelCase } from "./../helpers/namingConventions";
import FeatureController from "./feature";

type Props = {
  feature: string;
  name: string;
};
const initialSyncAction = ({ feature, name }: Props) => {
  const featureDir = `./redux/${feature}`;
  const actionName = toCamelCase(name);
  fs.writeFileSync(
    `${featureDir}/${actionName}.ts`,
    createSyncActionTemplate({ feature, name })
  );
  FeatureController.updateConstants({ feature, name });
  FeatureController.updateActions({ feature, name });
  FeatureController.updateReducer({ feature, name });
};

const initialAsyncAction = ({ feature, name }: Props) => {
  const featureDir = `./redux/${feature}`;
  const actionName = toCamelCase(name);
  fs.writeFileSync(
    `${featureDir}/${actionName}.ts`,
    createAsyncActionTemplate({ feature, name })
  );
  const CONSTANTS: Props[] = [
    { name: "Begin" },
    { name: "Failure" },
    { name: "Success" },
    { name: "DismissError" }
  ].map(item => ({ name: name + item.name, feature }));
  CONSTANTS.forEach(item => {
    FeatureController.updateConstants(item);
  });
  FeatureController.updateActions({ feature, name });
  FeatureController.updateReducer({ feature, name });
  FeatureController.updateInitialState({ feature, name });
};

export default {
  createSyncAction: initialSyncAction,
  createAsyncAction: initialAsyncAction
};
