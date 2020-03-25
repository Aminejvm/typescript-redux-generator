import { toPascalCase } from "../helpers/namingConventions";
const createReducerTemplate = ({
  feature
}: {
  feature: string;
}) => `import initialState from './initialState';

import { ${toPascalCase(feature)} } from './initialState'

export type ${toPascalCase(feature)}Actions = null
const reducers = [];

export default function reducer(state:${toPascalCase(
  feature
)} = initialState, action: ${toPascalCase(feature)}Actions) :${toPascalCase(
  feature
)}{
  let newState:${toPascalCase(feature)};
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}`;

export default createReducerTemplate;