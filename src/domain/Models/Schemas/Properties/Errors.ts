export interface ErrorSchema {
     error: {
          message: string,
          params?: Record<string, any>
     }
}