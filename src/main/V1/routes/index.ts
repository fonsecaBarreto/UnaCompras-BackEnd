import { Express, Router } from "express"
import fs from "fs"
import path from 'path'

export default async (app: Express) =>{

     console.log("\nSetting Routes ...")

     const router = Router();
     app.use('/api/v1', router) 

     await Promise.all(fs.readdirSync(__dirname).map( async (file:any) => {
          if (file.endsWith('.map') || file.split(".")[file.split(".").length - 2] !== "routes") return;
          (await import(`${__dirname}/${file}`)).default(router, app.get('keys'))
     }))

}