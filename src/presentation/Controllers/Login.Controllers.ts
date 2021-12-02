
import { Request, Response } from "@/presentation/Protocols/BaseMiddlware/BaseMiddleware";
import BC, { BaseController, Ok, Unauthorized } from "../Protocols/BaseController/BaseController";
import { IAuthentication_Service } from '@/domain/Interfaces/auth/Authentication'
import { SignIn_Schema } from "@/domain/Models/Schemas/LoginSchemas"

export class LoginController extends BC {

    constructor(
        private readonly _authenticationService: Pick<IAuthentication_Service, 'generateToken'>
    ){
        super(BaseController.AccessType.PUBLIC, { body: SignIn_Schema })
    }

    async handler(request: Request): Promise<Response> {

        const { emailOrPhone, password } = request.body
        const token = await this._authenticationService.generateToken({ email: emailOrPhone, password });
        
        if(!token) return Unauthorized();
        return Ok({ accessToken: token });

    }
}