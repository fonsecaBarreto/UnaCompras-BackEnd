/* 
     Título: Estabelecendo middlewares padrões para o 'Express'
     Autor: Lucas Fonseca
     data: 2021/11/11
*/

import { Express, Request, Response, NextFunction, json, urlencoded } from 'express'
import cors from 'cors';
//import { AuthenticateUserMiddleware } from '../V1/middlewares/UserAuthentication'
export default (app: Express) => {

     app.use((req: Request, res: Response, next: NextFunction) =>{
          console.log("\n > Nova Requisição:",req.method, req.path)
          next();
     })
      
     app.use(cors());

     app.use(json());

     app.use(urlencoded({ extended: true }));

     //app.use(AuthenticateUserMiddleware) 

}


