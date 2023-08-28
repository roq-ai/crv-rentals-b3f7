import { OutletInterface } from 'interfaces/outlet';
import { ToolInterface } from 'interfaces/tool';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CompanyInterface {
  id?: string;
  description?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  outlet?: OutletInterface[];
  tool?: ToolInterface[];
  user?: UserInterface;
  _count?: {
    outlet?: number;
    tool?: number;
  };
}

export interface CompanyGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
