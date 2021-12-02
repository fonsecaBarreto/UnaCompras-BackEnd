
export interface AccessTrace{
     id: string;
     account_id: string;
     name: string;
     logged_in_at: Date;
     logged_out_at: Date;
     ip_address:string;
     device: string;
     accessToken: string;
}

