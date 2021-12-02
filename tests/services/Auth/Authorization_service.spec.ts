import { ICompanyRepository, IUserRepository } from "@/domain/Interfaces/repositories"

import { HasherStub, EncrypterStub} from '@/tests/mocks/vendors'

import { Company, CompanyType } from "@/domain/Models/Entities/Companies"
import { MakeFakeCompany } from "@/tests/mocks/entities/MakeCompany"
import { AuthorizationServices } from "@/services/Auth/Authorization_services"
import { MakeFakeAccount } from "@/tests/mocks/entities/MakeAccount"
import { User } from "@/domain/Models/Views/User"
import { AccountsRole } from "@/domain/Models/Entities/Accounts"

const makeSut = () =>{

     class CompaniesRepositoryStub implements Pick<ICompanyRepository, "findByMangerId">{
          findByMangerId(account_id: string): Promise<Company> {
               return Promise.resolve(MakeFakeCompany({id: account_id}));
          }
     }

     const companiesRepository = new CompaniesRepositoryStub
     const encrypter = new EncrypterStub();
     const hasher =  new HasherStub()

     const sut = new AuthorizationServices(companiesRepository)
     return { sut, encrypter, hasher, companiesRepository }

}

describe("AuthorizationServices", () =>{
     describe("isAdmin", () =>{
          test("Should return false if non admin user", async () =>{
               const { sut } = makeSut()
               const res = await sut.isAdmin(new User(MakeFakeAccount({ role: AccountsRole.Client })))
               expect(res).toBe(false)
          })

          test("Should return true if admin user", async () =>{
               const { sut } = makeSut()
               const res = await sut.isAdmin(new User(MakeFakeAccount({ role: AccountsRole.Admin })))
               expect(res).toBe(true)
          })
     })

     describe("isVendor", () =>{
          test("Should return false if non client user", async () =>{
               const { sut } = makeSut()
               const res = await sut.isVendor(new User(MakeFakeAccount({ role: AccountsRole.Admin })))
               expect(res).toBe(false)
          })

          test("Should return false if company Repository return null", async () =>{
               const { sut, companiesRepository } = makeSut()
               jest.spyOn(companiesRepository,'findByMangerId').mockImplementationOnce(()=>{
                    return Promise.resolve(null);
               })
               const res = await sut.isVendor(new User(MakeFakeAccount({ role: AccountsRole.Client })))
               expect(res).toBe(false)
          }) 

          test("Should return false if company repository returns diferrent company type", async () =>{
               const { sut, companiesRepository } = makeSut()
               jest.spyOn(companiesRepository,'findByMangerId').mockImplementationOnce(()=>{
                    return Promise.resolve(MakeFakeCompany({ type: CompanyType.Customer }));
               })
               const res = await sut.isVendor(new User(MakeFakeAccount({ role: AccountsRole.Client })))
               expect(res).toBe(false)
          }) 

          test("Should return true if company repository returns company with correct company type", async () =>{
               const { sut, companiesRepository } = makeSut()
               jest.spyOn(companiesRepository,'findByMangerId').mockImplementationOnce(()=>{
                    return Promise.resolve(MakeFakeCompany({ type: CompanyType.Vendor }));
               })
               const res = await sut.isVendor(new User(MakeFakeAccount({ role: AccountsRole.Client })))
               expect(res).toBe(true)
          }) 
     })

     describe("isCustomer", () =>{
          test("Should return false if non client user", async () =>{
               const { sut } = makeSut()
               const res = await sut.isCustomer(new User(MakeFakeAccount({ role: AccountsRole.Admin })))
               expect(res).toBe(false)
          })

          test("Should return false if company Repository return null", async () =>{
               const { sut, companiesRepository } = makeSut()
               jest.spyOn(companiesRepository,'findByMangerId').mockImplementationOnce(()=>{
                    return Promise.resolve(null);
               })
               const res = await sut.isCustomer(new User(MakeFakeAccount({ role: AccountsRole.Client })))
               expect(res).toBe(false)
          }) 

          test("Should return false if company repository returns diferrent company type", async () =>{
               const { sut, companiesRepository } = makeSut()
               jest.spyOn(companiesRepository,'findByMangerId').mockImplementationOnce(()=>{
                    return Promise.resolve(MakeFakeCompany({ type: CompanyType.Vendor }));
               })
               const res = await sut.isCustomer(new User(MakeFakeAccount({ role: AccountsRole.Client })))
               expect(res).toBe(false)
          }) 

          test("Should return true if company repository returns company with correct company type", async () =>{
               const { sut, companiesRepository } = makeSut()
               jest.spyOn(companiesRepository,'findByMangerId').mockImplementationOnce(()=>{
                    return Promise.resolve(MakeFakeCompany({ type: CompanyType.Customer }));
               })
               const res = await sut.isCustomer(new User(MakeFakeAccount({ role: AccountsRole.Client })))
               expect(res).toBe(true)
          }) 
     })
}) 