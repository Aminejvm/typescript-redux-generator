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

  return `import {
  ${ACTION_CONSTANT}_BEGIN,
  ${ACTION_CONSTANT}_SUCCESS,
  ${ACTION_CONSTANT}_FAILURE,
  ${ACTION_CONSTANT}_DISMISS_ERROR,
} from './constants';
import {${FeatureType}} from './initialState'

export type ${ActionType} = 
        {type: typeof ${ACTION_CONSTANT}_BEGIN} | 
        {type: typeof ${ACTION_CONSTANT}_SUCCESS, payload: any} |
        {type: typeof ${ACTION_CONSTANT}_FAILURE} | 
        {type: typeof ${ACTION_CONSTANT}_DISMISS_ERROR}



type Args = {}
export function ${actionName}(args:Args = {}) {
  return (dispatch) => { // optionally you can have getState as the second argument
    dispatch({
      type: ${ACTION_CONSTANT}_BEGIN,
    });

    const promise = new Promise((resolve, reject) => {
      const doRequest = args.error ? Promise.reject(new Error()) : Promise.resolve();
      doRequest.then(
        (res) => {
          dispatch({
            type: ${ACTION_CONSTANT}_SUCCESS,
            payload: res,
          });
          resolve(res);
        },
        // Use rejectHandler as the second argument so that render errors won't be caught.
        (err) => {
          dispatch({
            type: ${ACTION_CONSTANT}_FAILURE,
          });

          dispatch({
            type: "FAILURE_NOTIFICATION",
            payload: {type:"notifFailure",title:"", message:""}
          })
          
          reject(err);
        },
      );
    });

    return promise;
  };
}

export function reducer(state:${FeatureType}, action:${ActionType}):${FeatureType} {
  switch (action.type) {
    case ${ACTION_CONSTANT}_BEGIN:
      // Just after a request is sent
      return {
        ...state,
        ${actionName}Pending: true,
      };

    case ${ACTION_CONSTANT}_SUCCESS:
      // The request is success
      return {
        ...state,
        ${actionName}Pending: false,
      };

    case ${ACTION_CONSTANT}_FAILURE:
      // The request is failed
      return {
        ...state,
        ${actionName}Pending: false,
      };

    default:
      return state;
  }
}
  `;
};

export default createSyncActionTemplate;
