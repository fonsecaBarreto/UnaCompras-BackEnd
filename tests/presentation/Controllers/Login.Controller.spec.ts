import { IAuthentication_Service } from '@/domain/Interfaces/auth/Authentication';
import { LoginController } from '@/presentation/Controllers/Login.Controllers'
import { MakeFakeRequest } from '../../mocks/protocols';
import { Ok, Unauthorized } from "@/presentation/Protocols/Http";

const Makesut = () =>{
     class AuthenticationStub implements  Pick<IAuthentication_Service, 'generateToken'>{
          generateToken(params: IAuthentication_Service.Params.generateToken): Promise<string> {
               return Promise.resolve("test_access_token");
          }
     }

     const authStub = new AuthenticationStub();

     const sut = new LoginController(authStub)

     return { sut, authStub };
}



describe("login controller", () => {
     test("Should call authentication Service with correct values", async () =>{
          const { sut, authStub } = Makesut()
          const authSpy = jest.spyOn(authStub, 'generateToken')
          const request = MakeFakeRequest({ body: { email: "any_email@mail.com", password: "any_password"} });
          await sut.handler(request);
          expect(authSpy).toHaveBeenCalledWith({email: "any_email@mail.com", password: "any_password"})
     })

     test("Should return unauthorized if authentication returns null", async () =>{
          const { sut, authStub } = Makesut()
          jest.spyOn(authStub, 'generateToken').mockImplementationOnce(()=>{
               return Promise.resolve(null)
          })
          const request = MakeFakeRequest({ body: { email: "any_email@mail.com", password: "any_password"} });
          const response = await sut.handler(request);
          expect(response).toEqual(Unauthorized())
         
     })

     test("Should return 200 ", async () =>{
          const { sut, authStub } = Makesut()
          const request = MakeFakeRequest({ body: { email: "any_email@mail.com", password: "any_password"} });
          const response = await sut.handler(request);
          expect(response).toEqual(Ok({ accessToken: "test_access_token"}))
         
     })
})

