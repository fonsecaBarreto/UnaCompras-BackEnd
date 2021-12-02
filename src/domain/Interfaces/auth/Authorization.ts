import { User } from "@/domain/Models/Views/User";

export interface IAuthorization_Service {
     isAdmin(user: User): Promise<boolean>
     isVendor(user: User): Promise<boolean>
     isCustomer(user: User): Promise<boolean>
}