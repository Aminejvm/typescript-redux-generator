import * as h from "inflection";

export const toPascalCase = (str: string) => h.camelize(str);
export const toCamelCase = (str: string) => h.camelize(str, true);
export const toUnderScore = (str: string) => h.underscore(str).toUpperCase();
