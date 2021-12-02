import { BaseEntity } from "../BaseEntity"

export interface ProductType extends BaseEntity{
     name:string;
     description:string;
     image:string;
}

