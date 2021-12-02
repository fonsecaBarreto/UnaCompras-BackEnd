import express, { Express } from 'express'
import useRootMiddlewares from './root_middlewares'
import getKeys, { EnviromentVariables } from './keys'
import useV1 from '../V1/index'

export async function setupApp (): Promise<Express>{

     const keys: EnviromentVariables = getKeys()
     const app = express()
     app.set('keys', keys)
     useRootMiddlewares(app)
     app.get("/status", (req, res) => res.json(({env: keys.NODE_ENV})) )
     await useV1(app)
     return app;
     
}

export default setupApp