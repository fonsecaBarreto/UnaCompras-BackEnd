import { BaseSchema } from "@/domain/Models/Schemas/BaseSchema"

/* Validator */
export namespace IValidator {
     export type Schema = BaseSchema
     export interface Params extends Record<string, any> {}
     export interface Errors extends Record<string, string> {}
}

export interface IValidator {
     validate(schema: IValidator.Schema, params: IValidator.Params): Promise<IValidator.Errors | null> 
}