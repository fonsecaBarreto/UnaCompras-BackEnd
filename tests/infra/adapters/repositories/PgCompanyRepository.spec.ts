import KnexAdapter from '@/infra/db/KnexAdapter'
import { PgCompanyRepository } from '@/infra/db/PgCompanyRepository'
import { NIL } from 'uuid'
import { User } from '@/domain/Models/Views/User'
/* stubs */
import { MakeFakeCompany, MakeFakeAddress, MakeFakeAccount } from '@/tests/mocks/entities'

const fakeAccounts = [ MakeFakeAccount(), MakeFakeAccount(), MakeFakeAccount()  ]
const fakeAddresses = [ MakeFakeAddress(), MakeFakeAddress(), MakeFakeAddress()  ]
const fakeCompanies = [
     MakeFakeCompany({ address_id: fakeAddresses[0].id, manager_id: fakeAccounts[0].id }),
];

const makeSut = () =>{
     const sut =  new PgCompanyRepository() 
     return sut;
}

describe("Companies Pg Repository", () =>{

     beforeAll(async ()=>{
          await KnexAdapter.open("test")
          await KnexAdapter.resetMigrations()
          await KnexAdapter.connection('accounts').insert(fakeAccounts)
          await KnexAdapter.connection('addresses').insert(fakeAddresses)
          await KnexAdapter.connection('companies').insert(fakeCompanies)
     })

     afterAll(async ()=>{  await KnexAdapter.close() })

     test('Should find company by id', async () =>{
          const sut = makeSut();
          const result = await sut.findById(fakeCompanies[0].id)
          expect(result).toMatchObject(fakeCompanies[0])
     })
     test('Should find company by cnpj', async () =>{
          const sut = makeSut();
          const result = await sut.findByCnpj(fakeCompanies[0].cnpj)
          expect(result).toMatchObject(fakeCompanies[0])
     })

     test('Should find company by Manager_id', async () =>{
          const sut = makeSut();
          const result = await sut.findByMangerId(fakeCompanies[0].manager_id)
          expect(result).toMatchObject(fakeCompanies[0])
     })

     test('Should remove company by id', async () =>{

          const companyToBeRemoved = MakeFakeCompany({address_id: fakeAddresses[1].id, manager_id: fakeAccounts[1].id});
          await KnexAdapter.connection('companies').insert(companyToBeRemoved);

          const count = await KnexAdapter.count('companies')
          const sut = makeSut();
    
          var result = await sut.remove(companyToBeRemoved.id)
          expect(result).toBe(true)

          result = await sut.remove(companyToBeRemoved.id)
          expect(result).toBe(false)

          const recontagem = await KnexAdapter.count('companies')
          expect(recontagem).toBe(  count -1 )
     }) 
     

     describe("upsert", () =>{

         
          test('Should add new company', async () =>{

               const count = await KnexAdapter.count('companies');
               const fakeCompany  = MakeFakeCompany({ address_id: fakeAddresses[2].id, manager_id: fakeAccounts[2].id })
               const sut = makeSut();
               await sut.upsert(fakeCompany)
               const recontagem = await KnexAdapter.count('companies')
               expect(recontagem).toBe( count + 1 )
          })

         test('[update] Should merge company if id were found', async () =>{

               const count = await KnexAdapter.count('companies') 
               const company = await KnexAdapter.connection('companies').where({ id: fakeCompanies[0].id }).first()
               expect(company).toMatchObject(fakeCompanies[0]) 
          
               const sut = makeSut();

               const companytoUpdate = { ...company,
                    company_name : "mudança de nome fantasia",
                    trade_name: "mudança do nome comercial",
                    cnpj: "123123dd23d23d23",
                    financial_email: "novoemailfinanceiro@mail.com"
               }

               await sut.upsert(companytoUpdate)

               var updatedUser = await KnexAdapter.connection('companies').where({ id: fakeCompanies[0].id }).first()
               
               const recontagem = await KnexAdapter.count('companies')

               expect(recontagem).toBe( count ) 

               expect(updatedUser).toEqual({ ...company, 
                    company_name : "mudança de nome fantasia",
                    trade_name: "mudança do nome comercial",
                    cnpj: "123123dd23d23d23",
                    financial_email: "novoemailfinanceiro@mail.com",
                    created_at: company.created_at, updated_at: updatedUser.updated_at }) 
          })   

     })  

})