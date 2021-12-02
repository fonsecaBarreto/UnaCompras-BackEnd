import { Account, AccountsRole } from "@/domain/Models/Entities/Accounts"
import { v4 } from "uuid"
import { hashSync } from 'bcrypt'
import faker from "faker"

export const MakeFakeAccount = ( params?: Partial<Account>): Account =>{
     return {
          id: v4(),
          name: "Conta Teste",
          password: hashSync("123456",12),
          role: AccountsRole.Client,
          cpf: Math.random() * 100 + Math.random() * 100 + Math.random() * 100  + "",
          email : faker.internet.email(),
          image: "fake_image_url", 
          phone: faker.phone.phoneNumber(),
          ...params
     }
}