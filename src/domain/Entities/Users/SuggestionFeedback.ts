import { BaseEntity } from "../BaseEntity"

export type SuggestionItem = {
     text: string,
     quantity: number
}

export interface SugestionFeedBack{
     id: string;
     account_id: string;
     text: string;
     items: SuggestionItem[];
     created_at: string;
}

