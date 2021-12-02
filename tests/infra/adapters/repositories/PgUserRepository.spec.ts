import KnexAdapter from '@/infra/db/KnexAdapter'
import { PgUsersRepository } from '@/infra/db/PgUserRepository'
import { NIL } from 'uuid'
import { User } from '@/domain/Models/Views/User'
/* stubs */
import {  MakeFakeAccount } from '@/tests/mocks/entities'

const fakeAccounts = [
     MakeFakeAccount({ name: "Usuario um", email: 'email_test_01@mail.com'}),
     MakeFakeAccount({ name: "Usuario basico mas sem referencias", email: 'email_test_02@mail.com'}),
     MakeFakeAccount({ name: "Usuario ", email: 'email_test_03@mail.com'})
];

const makeSut = () =>{
     const sut =  new PgUsersRepository() 
     return sut;
}

describe("Users Pg Repository", () =>{

     beforeAll(async ()=>{
          await KnexAdapter.open("test")
          await KnexAdapter.resetMigrations()
          await KnexAdapter.connection('accounts').insert(fakeAccounts)
     })

     afterAll(async ()=>{  await KnexAdapter.close() })

     describe("Find Accounts", () =>{

          test('Should find account by email', async () =>{
               const sut = makeSut();
               const result = await sut.findByEmail(fakeAccounts[0].email, ["id", "email", "name", "password"] )
               expect(result).toEqual({ id: fakeAccounts[0].id, email: fakeAccounts[0].email, name: fakeAccounts[0].name, password: fakeAccounts[0].password })
          })

          test('Should find account by phone', async () =>{
               const sut = makeSut();
               const result = await sut.findByPhone(fakeAccounts[0].phone)
               expect(result).toMatchObject(fakeAccounts[0])
          })

          test('Should find account by cpf', async () =>{
               const sut = makeSut();
               const result = await sut.findByCpf(fakeAccounts[0].cpf)
               expect(result).toMatchObject(fakeAccounts[0])
          })
     }) 


     test('Should find user By id', async () =>{
          const sut = makeSut();
          const result = await sut.findById(fakeAccounts[0].id)
          expect(result).toMatchObject(fakeAccounts[0])
     })

     test('Should remove account by id', async () =>{

          const accountToBeRemoved = MakeFakeAccount();
          await KnexAdapter.connection('accounts').insert(accountToBeRemoved);
          const sut = makeSut();
          const count = await KnexAdapter.count('accounts')
          var result = await sut.remove(accountToBeRemoved.id)
          expect(result).toBe(true)

          result = await sut.remove(accountToBeRemoved.id)
          expect(result).toBe(false)

          const recontagem = await KnexAdapter.count('accounts')
          expect(recontagem).toBe(  count -1 )
     })


     describe("Find User", () =>{

          test('Should find user View', async () =>{
               const sut = makeSut();
               const result = await sut.findUser(fakeAccounts[0].id)
               expect(result).toMatchObject(new User(fakeAccounts[0]))
          })

     }) 
     

     describe("upsert", () =>{

          test('Should add new account', async () =>{
               const count = await KnexAdapter.count('accounts')
               const sut = makeSut();
               const fakeAccount = MakeFakeAccount()
               await sut.upsert(fakeAccount)

               const recontagem = await KnexAdapter.count('accounts')
               expect(recontagem).toBe( count + 1 )
          })

          test('[update] Should merge user if id were found', async () =>{

               const count  = await KnexAdapter.count('accounts') 
               const user = await KnexAdapter.connection('accounts').where({ id: fakeAccounts[0].id }).first()
               expect(user).toMatchObject(fakeAccounts[0]) 
          
               const sut = makeSut();
               const userToUpdate = { ...user, email: "novoemail@mail.com", name: "Nome atualizado" }
               await sut.upsert(userToUpdate)

               const recontagem = await KnexAdapter.count('accounts')
               expect(recontagem).toBe( count ) 

               var updatedUser = await KnexAdapter.connection('accounts').where({ id: fakeAccounts[0].id }).first()

               expect(updatedUser).toEqual({ ...user, email: "novoemail@mail.com", name: "Nome atualizado" , created_at: user.created_at, updated_at: updatedUser.updated_at }) 
          })

     })  
})