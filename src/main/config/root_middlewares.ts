import { Express, Request, Response, NextFunction, json, urlencoded } from 'express'
import cors from 'cors';

export default (app: Express) => {

     app.use(RequestLog())

     app.use(cors());

     app.use(json());

     app.use(urlencoded({ extended: true }));
}

function RequestLog(){
     return (req: Request, res: Response, next: NextFunction) =>{
          console.log("\n >",req.method, req.path)
          next();
     }
}

