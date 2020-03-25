import generate from '@babel/generator'
import * as parser from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import * as fs from 'fs'
import { createRootReducerTemplate } from '../templates'

const initiateRedux = () => {
  fs.mkdirSync('./redux')
  fs.writeFileSync('./redux/rootReducer.ts', createRootReducerTemplate())

  // Initiating Hooks
  fs.mkdirSync('./redux/hooks')
  fs.writeFileSync('./redux/hooks/index.ts', '')

  // Initiate Index.ts
  fs.writeFileSync(
    './redux/index.ts',
    `export { default as rootReducer } from './rootReducer';
export * from './hooks'
`
  )
}

type Props = {
  feature: string;
};
const updateRootReducer = ({feature}: Props): void => {
  const rootReducerCode = fs.readFileSync('./redux/rootReducer.ts', 'utf8')
  const rootReduceAst = parser.parse(rootReducerCode, {sourceType: 'module'})
  traverse(rootReduceAst, {
    enter(path) {
      if (path.isObjectExpression()) {
        path.node.properties.push(
          t.objectProperty(
            t.identifier(feature),
            t.identifier(`${feature}Reducer`)
          )
        )
      }
    },
  })
  rootReduceAst.program.body.unshift(
    t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(`${feature}Reducer`))],
      t.stringLiteral(`./${feature}/reducer`)
    )
  )
  fs.writeFileSync('./redux/rootReducer.ts', generate(rootReduceAst).code)
}

export default {
  initiate: initiateRedux,
  updateRootReducer,
}
