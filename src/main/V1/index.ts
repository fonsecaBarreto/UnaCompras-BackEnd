import { Express } from "express"

import SingletonConfig from './factories/singletonConfig'

import useRoutes from "./routes"
import useMiddlewares from "./middlewares"

export default async (app: Express): Promise<void>  => {
     
     await SingletonConfig(app.get("keys"))        // Instancia as dependencias 'staticas' da Aplicação

     useMiddlewares(app)

     useRoutes(app) 
     
}
  