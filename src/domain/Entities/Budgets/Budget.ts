import { BaseEntity } from "../BaseEntity"

export interface Budget extends BaseEntity{
     customer_id: string;
}

export interface BudgetItem extends BaseEntity{
     budget_id:string;
     product_id:string;
     vendor_id: string;
     quantity: number;
     required_date: string;
     status: string;
}

