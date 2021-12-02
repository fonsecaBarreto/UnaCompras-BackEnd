import { Request, Response } from '../Http'

export namespace BaseMiddleware{
} 

export interface BaseMiddleware {
     _handler(request: Request): Promise<Response> 
     execute(): any
}
