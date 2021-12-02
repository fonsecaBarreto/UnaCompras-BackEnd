import { IAuthentication_Service } from '@/domain/Interfaces/auth/Authentication';
import { AuthenticationMiddleware } from '@/presentation/Middlewares/Authentication.Middlewares'
import { MakeFakeRequest } from '../../mocks/protocols';
import { User } from '@/services/Accounts_Services/IAccounts_Services';
import { MakeFakeAccount } from '../../mocks/entities';

const Makesut = () =>{

     const fakedUsers = [ new User(MakeFakeAccount())];

     class AuthenticationStub implements  Pick<IAuthentication_Service, 'authenticate'>{
          authenticate(params: IAuthentication_Service.Params.authenticate): Promise<User> {
               return Promise.resolve(fakedUsers[0]);
          }
     }

     const authStub = new AuthenticationStub();

     const sut = new AuthenticationMiddleware(authStub)

     return { sut, authStub, fakedUsers };
}

describe("login controller", () => {
     test("Should return null if no token were provided at the header or query string", async () =>{
          const { sut, } = Makesut()
          const request = MakeFakeRequest({ });
          await sut.handler(request);
          expect(request.user).toBe(null) 
     })

     test("Should call authentication service with correct values", async () =>{
          const { sut, authStub } = Makesut()
          const authSpy = jest.spyOn(authStub,'authenticate')
          const request = MakeFakeRequest({ headers: { authorization: "Bearer Some_athorizationToken" } });
          await sut.handler(request);
          expect(authSpy).toHaveBeenCalledWith({access_token: "Some_athorizationToken"})
     })

     test("Should return null if no user were returned", async () =>{
          const { sut, authStub } = Makesut()
          jest.spyOn(authStub,'authenticate').mockImplementationOnce(()=>{
               return Promise.resolve(null);
          })
          const request = MakeFakeRequest({ headers: { authorization: "Bearer Some_athorizationToken" } });
          const resp = await sut.handler(request);
          expect(resp).toBe(null)
          expect(request.user).toBe(null)
     })

     test("Should inject user on request ", async () =>{
          const { sut, authStub, fakedUsers } = Makesut()
          const request = MakeFakeRequest({ headers: { authorization: "Bearer Some_athorizationToken" } });
          await sut.handler(request);
          expect(request.user).toMatchObject(fakedUsers[0])
     })
})

