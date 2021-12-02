import { User } from "@/domain/Models/Views/User"
export * from './http-helper'

export type Request = {
    params: any,
    query: any,
    headers: any
    body?:any,
    user?: User,
    files?: Record<string, any>
}

export type Response = {
    status: number,
    body?: any,
    headers?: object
}
