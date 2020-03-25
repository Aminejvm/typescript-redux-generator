import { toPascalCase } from '../helpers/namingConventions';
const createInitialStateTemplate = ({feature}:{feature:string})=>`
export type ${toPascalCase(feature)} = {

}
const initialState: ${toPascalCase(feature)} = {

};

export default initialState;
`

export default createInitialStateTemplate;