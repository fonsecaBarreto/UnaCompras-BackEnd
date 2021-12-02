import { BaseEntity } from "../BaseEntity"

export interface FileUpload extends BaseEntity{
     account_id: string;
     src: string;
     name: string;
     contentType: string;
     size: string;
}

