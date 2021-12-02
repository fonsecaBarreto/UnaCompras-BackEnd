import { BaseEntity } from "../BaseEntity"


export interface Product extends BaseEntity{
     brand_id: string;
     type_id: string;
     specification: string;
     presentation: string;
     ncm: string;
     ean: string;
     sku: string;
     image: string;
}

