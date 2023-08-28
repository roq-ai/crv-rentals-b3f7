import { RentalInterface } from 'interfaces/rental';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface OutletInterface {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  rental?: RentalInterface[];
  company?: CompanyInterface;
  _count?: {
    rental?: number;
  };
}

export interface OutletGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  company_id?: string;
}
