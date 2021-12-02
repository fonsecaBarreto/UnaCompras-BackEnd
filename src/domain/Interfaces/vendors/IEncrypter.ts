import { IAuthentication_Service } from '../../Interfaces/auth/Authentication'

export namespace IEncrypter {
     export type Params =  Omit<IAuthentication_Service.TokenPayload, 'iat' | 'exp'>
     export type Payload = IAuthentication_Service.TokenPayload
}

export interface IEncrypter {
     sign(payload: IEncrypter.Params, exp_days: number): Promise<string>
     verify(token: string): Promise<IEncrypter.Payload>
}
