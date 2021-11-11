import { Router, Express } from 'express'
import useRouteV1 from '../V1/index'

export default async (app: Express): Promise<void>  => {

     const keys = app.get('keys')

     app.get("/status", (req, res) => res.json(({env: keys.NODE_ENV})) )

     await useRouteV1(app, keys)

}
  