
import BaseMiddleware, { Request, Response } from "@/presentation/Protocols/BaseMiddlware/BaseMiddleware";
import { IAuthentication_Service } from '@/domain/Interfaces/auth/Authentication'

export class AuthenticationMiddleware extends BaseMiddleware {
     constructor(
          private readonly _authenticationService: Pick<IAuthentication_Service, 'authenticate'>
     ){ super() }
     async handler(request: Request): Promise<Response> {
          const { headers, query } = request ;

          var token: string | null = headers.authorization ? headers.authorization.split(' ')[1] : null
          if(!token) { token = query.a ? query.a + "" : null }
          if(token) {
               const user = await this._authenticationService.authenticate({ access_token: token })   
               if (user) { request.user = user } 
          }
          return null;
     }
}