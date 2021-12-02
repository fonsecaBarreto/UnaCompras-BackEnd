export interface IBaseRepository<T> {
     findById(id:string): Promise<T>
     remove(id:string): Promise<boolean>
     upsert(model:T): Promise<void>
}