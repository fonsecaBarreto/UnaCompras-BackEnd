/* 
     Título: Configuração App Express
     Autor: Lucas Fonseca
     data: 2021/11/11
*/

import express, { Express } from 'express'
import useMiddlewares from './middlewares'
import useRoutes from './routes'
import KnexAdapter from '../../infra/db/KnexAdapter'
import getKeys, { ENV_VARIABLES } from './keys'

export async function setupApp (): Promise<Express>{

     const keys = getKeys()

     await KnexAdapter.open(keys.NODE_ENV);

     const app = express()

     app.set('keys', keys)

     useMiddlewares(app)

     await useRoutes(app)

     return app
}


export async function closeApp() {
     
     await KnexAdapter.close();
     return
}

export default setupApp