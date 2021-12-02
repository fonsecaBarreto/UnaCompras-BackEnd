


import Express, { NextFunction } from 'express'
import { Request, Response, Unprocessable, Unauthorized, ServerError } from '../Http'
import { BaseMiddleware as BM } from './IBaseMiddeware'
export * from '../Http'
export * from '../http-helper'



export abstract class AppBaseMiddleware implements BM {

     constructor( ){ }

     abstract handler(request: Request):  Promise<Response | null> 
    
     async _handler(request: Request): Promise<Response>{

          try{

               return await this.handler(request);

          } catch(err: any) {
               console.log( console.log("\n ** ServerError: ", err.stack) )   
               return ServerError()
          }   
     }


     execute() {
          return async (req : Express.Request, res: Express.Response, next: NextFunction) => {

               var request: Request = {  
                    headers: req.headers,  
                    body: req.body || {}, 
                    params: req.params, 
                    query: req.query,
                    files: req.files, 
                    user: req.user
               }
               
               const response = await this._handler(request);

               if(response){
                    if(response.status >= 400 && response.status < 500 ) // Armazer os logs de erro posteriormente
                    console.log("\n\n *** Client Error: ", response.body?.name || response.body);
                    return res.status(response.status).json(response.body); 
               }

               Object.assign(req, { ...req, ...request})

               next();
          }
     }
}

export default AppBaseMiddleware;


