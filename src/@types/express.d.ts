import { UserView } from "../domain/Views/UserView";

declare global {
     namespace Express {
          interface Request {
               files: any,
               user: any
          }
     }
}