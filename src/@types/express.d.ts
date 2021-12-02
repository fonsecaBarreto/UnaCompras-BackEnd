import { User } from "../domain/Models/Views/User";

declare global {
     namespace Express {
          interface Request {
               files: any,
               user: User
          }
     }
}