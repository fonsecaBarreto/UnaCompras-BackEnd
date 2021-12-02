
import JsonWebTokenAdapter, { IEncrypter } from "@/infra/adapters/JsonWebTokenAdapter"

import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any_token'
  },

  async verify (): Promise<any> {
    return (
         {
          account_id: "test_account_id",
          email: "any_email@mail.com",
          name: "any_name", 
          iat: 123456789,
          exp: 123456789
         }
    )
  }
}));

const makeSut = () =>{
     const sut = new JsonWebTokenAdapter('123456')

     return { sut };
}

const MakeFakeEncrypterParams = (): IEncrypter.Params =>{
     return ({
          name: "Nome Qualquer",
          email: "Um E-mail qualquer",
          account_id: "any_account_id"
     })
}
describe("Testing JsonWebtoken Adapter", () =>{
     describe("sign", () =>{
  
          test("Should return null if jwt returns any error", async () =>{
               const { sut } = makeSut();
              jest.spyOn(jwt, 'sign').mockImplementationOnce(()=>{
                    return Promise.reject(new Error("Any erro"))
               })
               const params = MakeFakeEncrypterParams()
               const result = await sut.sign(params, 7);
               expect(result).toBe(null)
          })

          test("Should return data", async () =>{
               const { sut } = makeSut();
                const params = MakeFakeEncrypterParams()
                const result = await sut.sign(params, 7);
                expect(result).toBe('any_token')
          }) 
     })

     describe("verify", () =>{
  
          test("call jwt verify with correct values", async () =>{
               const { sut } = makeSut();
               const verifyspy = jest.spyOn(jwt, 'verify')
               await sut.verify("any_access_token");
               expect(verifyspy).toHaveBeenLastCalledWith("any_access_token","123456")
          })

          test("call jwt verify should return data", async () =>{
               const { sut } = makeSut();
               const data= await sut.verify("any_access_token");
               expect(data).toEqual({
                    account_id: "test_account_id",
                    email: "any_email@mail.com",
                    name: "any_name", 
                    iat: 123456789,
                    exp: 123456789
               })
          })

     })
})