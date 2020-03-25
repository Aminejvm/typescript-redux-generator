const createRootReducerTemplate = () => `import { combineReducers } from 'redux';
const reducerMap = {};
export default combineReducers(reducerMap);`;

export default createRootReducerTemplate;