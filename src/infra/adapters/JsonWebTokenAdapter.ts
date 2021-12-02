
import { sign, verify  } from 'jsonwebtoken'
import { IEncrypter } from '@/domain/Interfaces/vendors/IEncrypter'
export * from '@/domain/Interfaces/vendors/IEncrypter'

export default class JsonWebTokenAdapter implements IEncrypter {
    constructor(
        private readonly secret:string
    ){}

    async sign(payload:  IEncrypter.Params, exp_days: number ): Promise<string> {
        try{
            const iat =  Math.floor( Date.now() / 1000 ) ;
            const exp = Math.floor( Date.now() / 1000 ) + ( 86400 * exp_days ) ;
            const token = await sign({ ...payload, iat, exp }, this.secret)
            return token
        } catch(err: any ){
            return null
        }
    }

    async verify(token: string): Promise<IEncrypter.Payload> {
        var returned: any = await verify(token, this.secret)
        const decoded: IEncrypter.Payload = { ...returned }
        return decoded;
    }
}

