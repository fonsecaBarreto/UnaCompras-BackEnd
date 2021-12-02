import { BaseEntity } from "../BaseEntity"


export interface VendorsProducts extends BaseEntity{
     vendor_id: string;
     product_id: string;
     quantity: number;
     price: number;
}