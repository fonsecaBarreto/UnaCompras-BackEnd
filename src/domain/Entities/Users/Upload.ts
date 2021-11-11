import { BaseEntity } from "../BaseEntity"

export interface Upload extends BaseEntity{
     account_id: string;
     src: string;
     name: string;
     contentType: string;
     size: string;
}

