import { toCamelCase, toPascalCase, toUnderScore } from "../helpers/namingConventions";
type Props = {
  feature: string;
  name: string;
};
const createSyncActionTemplate = ({ feature, name }: Props) => {
  const ACTION_CONSTANT = toUnderScore(feature + toPascalCase(name));
  const FeatureType = toPascalCase(feature);
  const actionName = toCamelCase(name);
  const ActionType = `${toPascalCase(name)}Action`;

  return `import { ${ACTION_CONSTANT} } from './constants';
import {${FeatureType}} from './initialState'

export type ${ActionType} = {
  type: typeof  ${ACTION_CONSTANT}
}

export function ${actionName}(): ${ActionType}{
  return {
    type: ${ACTION_CONSTANT},
  };
}

export function reducer(state: ${FeatureType} , action: ${ActionType}) {
  switch (action.type) {
    case ${ACTION_CONSTANT}:
      return {
        ...state,
      };

    default:
      return state;
  }
}`;
};

export default createSyncActionTemplate;
