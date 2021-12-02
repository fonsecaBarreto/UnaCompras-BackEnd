import { Express } from "express"
import { MakeAuthenticationMidleware } from '../factories/authentication-factory'

export default (app: Express) =>{

     console.log("\nSetting Middleware ...")
     const authenticationMiddleware = MakeAuthenticationMidleware(app.get("keys"))
     
     app.use(authenticationMiddleware.execute())

}