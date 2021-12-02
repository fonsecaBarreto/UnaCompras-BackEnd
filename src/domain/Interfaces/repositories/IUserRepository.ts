import { AccessTrace, Account, FileUpload, RatingFeedBack, SugestionFeedBack } from '@/domain/Models/Entities/Accounts';
import { User } from '@/domain/Models/Views/User';
import { IBaseRepository } from './IBaseRepository'

export interface IUserRepository extends IBaseRepository<Account> {
     
     /*  Account */
     findByEmail(email: string, select?: string[]): Promise<Account | Partial<Account>>
     findByPhone(phone: string, select?: string[]): Promise<Account | Partial<Account>>
     findByCpf(cpf: string, select?: string[]): Promise<Account | Partial<Account>>
     /* User */
     findUser(id:string): Promise<User>

}

/*  */
/* export interface AccessTraceRepository {
     add(rating: AccessTrace): Promise<null>
}

export interface RatingFeedBackRepository {
     upsert(rating: RatingFeedBack): Promise<null>
}

export interface SuggestionFeedBackRepository {
     add(suggestion: SugestionFeedBack): Promise<null> 
}
 
export interface FileUploadRepository {
     add(file: FileUpload): Promise<null>
}
  */