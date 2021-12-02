import { EnviromentVariables } from '@/main/config/keys';
import { Router } from 'express'

import { MakeLoginController } from '../factories/login-factories'

export default function ( ExpressRouter: Router,  keys: EnviromentVariables){

     const router = Router();
     ExpressRouter.use('/login',router);

     const loginController = MakeLoginController(keys);

     router.post('/signin', loginController.execute())

}

