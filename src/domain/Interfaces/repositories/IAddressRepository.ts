import { Address } from '@/domain/Models/Entities/Companies';
import { AddressView } from "@/domain/Models/Views/AddressView"
import { IBaseRepository } from './IBaseRepository'

export interface IAddressRepository extends IBaseRepository<Address>{
     findAddress(id:string): Promise<AddressView>
}