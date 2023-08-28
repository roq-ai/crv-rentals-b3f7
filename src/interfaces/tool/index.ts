import { RentalInterface } from 'interfaces/rental';
import { CompanyInterface } from 'interfaces/company';
import { GetQueryInterface } from 'interfaces';

export interface ToolInterface {
  id?: string;
  name: string;
  description?: string;
  availability?: boolean;
  company_id: string;
  created_at?: any;
  updated_at?: any;
  rental?: RentalInterface[];
  company?: CompanyInterface;
  _count?: {
    rental?: number;
  };
}

export interface ToolGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  company_id?: string;
}
