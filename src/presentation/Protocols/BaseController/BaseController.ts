import Express from 'express'
import { Request, Response, Unprocessable, Unauthorized, ServerError } from '../Http'
import { BaseController as BC } from './IBaseController'
import { Forbidden } from '../http-helper'
import { UserNotAllowedError } from '@/domain/Models/Errors'
export * from './IBaseController'
export * from '../Http'

export abstract class AppBaseController implements BC {
     /* STATIC */
    public static _validator: BC.Validator;                // Static Validator
    public static _authorizator: BC.Authorizator

    constructor( 
        public readonly _accessType: BC.AccessType = BC.AccessType.PUBLIC,
        public readonly _schemas?: BC.RequestsSchema   
    ){ }

    abstract handler(request: Request):  Promise<Response> 

    async validationGuard(request: Request): Promise<any> {
        if(!this._schemas) return;
        const { body, params } = request;

        if(this._schemas.params){
            let hasError = await AppBaseController._validator.validate(this._schemas.params, params)
            if(hasError) return hasError;
        } 
    
        if(this._schemas.body){
            let hasError = await AppBaseController._validator.validate(this._schemas.body, body)
            if(hasError) return hasError;
        }
        return;
    }

    async authorizationGuard(req: Request): Promise<boolean> {
        
        const { user } = req;

        if( this._accessType === BC.AccessType.PUBLIC) return true;
        
        if( !user || !user.role ) return false;
    
        var isValid = false;
        try{
            switch(this._accessType){
                case BC.AccessType.USER:    
                        isValid = true;   
                break;
                
                case BC.AccessType.ADMIN:     
                        isValid = await AppBaseController._authorizator.isAdmin(user);
                break;
                
                case BC.AccessType.CUSTOMER : 
                        isValid = await AppBaseController._authorizator.isCustomer(user);
                break;
                
                case BC.AccessType.VENDOR :   
                        isValid = await AppBaseController._authorizator.isVendor(user);
                break;
                
                default:                     
                        isValid = false;
                break;
            }

        }catch(err){
            console.log("Erro na Autorização", err) // Guardar Logs
            return false
        }

        return isValid
    }

    async _handler(request: Request): Promise<Response>{
        try{
            const isAuthorized = await this.authorizationGuard(request)
            if(!isAuthorized) return Forbidden(new UserNotAllowedError());

            const hasError = await this.validationGuard(request)
            if(hasError) return Unprocessable(hasError);

            return await this.handler(request);

        } catch(err: any) {
            console.log( console.log("\n ** ServerError: ", err.stack) )   
            return ServerError()
        }   
    }

    execute(){
        return  async (req : Express.Request, res: Express.Response) => {

            var request: Request = {  
                headers: req.headers,  
                body: req.body || {}, 
                params: req.params, 
                query: req.query,
                files: req.files, 
                user: req.user
            }

            const response = await this._handler(request);
            
            if(response.status >= 400 && response.status < 500 ) // Armazenar os logs de erro posteriormente
                console.log("\n\n *** Client Error: ", response.body?.name || response.body);

            return res.status(response.status).json(response.body); 
        }
    }
}


export default AppBaseController;