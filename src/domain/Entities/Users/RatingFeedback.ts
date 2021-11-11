import { BaseEntity } from "../BaseEntity"

export interface RatingFeedBack extends BaseEntity{
     id: string;
     account_id: string;
     text: string;
     grade: number;
}

