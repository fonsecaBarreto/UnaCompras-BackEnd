
import BC, { BaseController, Ok, Request, Response } from "../Protocols/BaseController/BaseController";

export class AdminTesteController extends BC {

     constructor(){
          super(BaseController.AccessType.PUBLIC)
     }

     async handler(request: Request): Promise<Response> {

          console.log('Testando aqui')
          return Ok(request);

     }
}

