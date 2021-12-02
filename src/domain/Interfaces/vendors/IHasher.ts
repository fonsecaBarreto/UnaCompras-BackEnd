export interface IHasher {
     hash(value: string): string,
     compare(value:string, hash:string): boolean
}