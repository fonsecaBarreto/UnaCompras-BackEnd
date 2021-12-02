import { BaseSchema } from "@/domain/Models/Schemas/BaseSchema"
import { IValidator } from "@/domain/Interfaces/vendors/IValidator"
import { Request, Response } from '../Http'
import { IAuthorization_Service } from "@/domain/Interfaces/auth/Authorization"

export namespace BaseController {
    export type Authorizator = IAuthorization_Service
    export type Validator = IValidator
    export type Schema = BaseSchema
    export interface RequestsSchema { body?: Schema,  params?: Schema }
    export enum AccessType {
        PUBLIC,
        CUSTOMER,
        VENDOR,
        ADMIN,
        USER
    }
} 

export interface BaseController {
    _handler(request: Request): Promise<Response>
    validationGuard( request: Request ): Promise<any> 
    authorizationGuard( request: Request ): Promise<boolean> 
    execute(): any
}
