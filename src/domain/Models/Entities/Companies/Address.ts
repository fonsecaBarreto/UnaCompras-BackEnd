import { BaseEntity } from "../BaseEntity";

export interface Address extends BaseEntity{
     street:string
     number:string
     details: string
     district:string
     city: string
     uf: string
     postalCode: string
}