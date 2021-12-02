import { Account } from "@/domain/Models/Entities/Accounts"
import { User } from "@/domain/Models/Views/User"

import { IUserRepository } from "@/domain/Interfaces/repositories"

import { MakeFakeAccount } from "@/tests/mocks/entities/MakeAccount"
import { HasherStub, EncrypterStub} from '@/tests/mocks/vendors'

import { AuthenticationServices } from "@/services/Auth/Authentication_Services"

const makeSut = () =>{

     const fakedAccounts = [ MakeFakeAccount({id: "test_account_id"})]
     const fakedUsers = [ new User(fakedAccounts[0])];

     class UsersRepositoryStub implements Pick<IUserRepository, "findUser" | "findByEmail"> {
          async findByEmail(email: string, select?: string[]): Promise<Account | Partial<Account>> {
               return fakedAccounts[0];
          }

          async findUser(id: string): Promise<User> {
               return fakedUsers[0];
          }
     }

     const usersRepository = new UsersRepositoryStub
     const encrypter = new EncrypterStub();
     const hasher =  new HasherStub()

     const sut = new AuthenticationServices(usersRepository, hasher, encrypter)
     return { sut, encrypter, hasher, usersRepository, fakedAccounts, fakedUsers }

}

describe("AuthenticationServices", () =>{
     describe("generateToken", () =>{
          test("Should call repository with correct values", async () =>{
               const { sut, usersRepository } = makeSut();
               const spy = jest.spyOn(usersRepository, 'findByEmail');
               await sut.generateToken({ email: "any_email@mail.com", password:"any_password" });
               expect(spy).toHaveBeenCalledWith('any_email@mail.com', ["id", "email", "name" ]);
          })

          test("Should return null if no user were found", async () =>{
               const { sut, usersRepository } = makeSut();
               const spy = jest.spyOn(usersRepository, 'findByEmail').mockImplementationOnce(async ()=> null);
               const resp = await sut.generateToken({ email: "any_email@mail.com", password:"any_password" });
               expect(resp).toBe(null);
          })

          test("Should call hasher with correct values", async () =>{
               const { sut, hasher, fakedAccounts} = makeSut()
               const spy = jest.spyOn(hasher, 'compare')
               await sut.generateToken({ email:"any_email@mail.com", password: "any_password" })
               expect(spy).toHaveBeenCalledWith('any_password',fakedAccounts[0].password )
          })

          test("Should return null if password doesnt match", async () =>{
               const { sut, hasher, fakedAccounts, fakedUsers } = makeSut()
               const spy = jest.spyOn(hasher, 'compare').mockImplementationOnce( ()=> false)
               const resp = await sut.generateToken({ email:"any_email@mail.com", password: "any_password" })
               expect(resp).toBe(null)
          })

          // Encrypter
          test("Should call encrypter with correct values ", async () =>{
               const { sut, encrypter, fakedAccounts} = makeSut()
               const spy = jest.spyOn(encrypter, 'sign').mockImplementationOnce( async ()=> { throw new Error("qualquer error")})
               await sut.generateToken({ email:"any_email@mail.com", password: "any_password" })
               expect(spy).toHaveBeenCalledWith(
                    {
                         account_id: fakedAccounts[0].id,
                         email: fakedAccounts[0].email,
                         name: fakedAccounts[0].name,
                    }, 15)
          })

          test("Should return null if encrypter throws ", async () =>{
               // Encrypter
               const { sut, encrypter } = makeSut()
               jest.spyOn(encrypter, 'sign').mockImplementationOnce( async ()=> { throw new Error("qualquer error")})
               const result = await sut.generateToken({ email:"any_email@mail.com", password: "any_password" })
               expect(result).toBe(null)
          })

          test("Should return a accessToken", async () =>{
               const { sut } = makeSut()
               const resp = await sut.generateToken({ email:"any_username", password:"any_password" })
               expect(resp).toBe("generated_access_token")
          }) 
    
     })

     describe("authenticate", () =>{

          test("Should call encrypter with correct values", async () =>{

               const { sut, encrypter } = makeSut()
               const spy = jest.spyOn(encrypter, 'verify')
               await sut.authenticate({ access_token: "any_token" });
               expect(spy).toHaveBeenCalledWith('any_token')
          })
          test("Should return null if encrypter throws", async () =>{
               const { sut, encrypter } = makeSut()
               jest.spyOn(encrypter, 'verify').mockImplementationOnce(async()=>{
                    throw new Error("Error qualquer")
               })
               const resp = await sut.authenticate({ access_token: "any_token" });
               expect(resp).toBe(null)
          })

          test("Should return null if encrypter return null", async () =>{
               const { sut, encrypter } = makeSut()
               const spy = jest.spyOn(encrypter, 'verify').mockImplementationOnce(async()=>{
                    return null
               })
               const resp = await sut.authenticate({ access_token: "any_token" });
               expect(resp).toBe(null)
          })

          test("Should call repository with correct values", async () =>{
               const { sut, usersRepository } = makeSut()
               const spy = jest.spyOn(usersRepository, 'findUser')
               await sut.authenticate({ access_token: "any_token" });
               expect(spy).toHaveBeenCalledWith('test_account_id')
          })

          test("Should call return user", async () =>{
               const { sut,fakedUsers } = makeSut()
               const resp = await sut.authenticate({ access_token: "any_token" });
               expect(resp).toEqual(fakedUsers[0])
          }) 
     }) 
}) 