import { User } from "@/domain/Models/Views/User";

export namespace IAuthentication_Service {
     export namespace Params {
          export type generateToken ={
               email: string;
               password: string;
          }
          export type authenticate ={
               access_token: string;
          }
     }
     export type TokenPayload ={
          account_id: string,      // Id da conta
          email: string,           // email do usuario
          name: string,            // Nome do Usuario
          iat: string,             // Tempo inicial
          exp: string              // Tempo Expiração
     }
}

export interface IAuthentication_Service {
    generateToken(params: IAuthentication_Service.Params.generateToken): Promise<string>
    authenticate(params: IAuthentication_Service.Params.authenticate): Promise<User>
}