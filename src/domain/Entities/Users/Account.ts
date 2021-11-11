import { BaseEntity } from "../BaseEntity"

export enum AccountsRole{
     Basic = 1,
     Client = 2
}

export interface Account extends BaseEntity{
     name: string;
     email: string;
     phone: string;
     cpf: string;
     password: string;
     image: string;
     role: AccountsRole
}

