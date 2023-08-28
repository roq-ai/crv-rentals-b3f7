import axios from 'axios';
import queryString from 'query-string';
import { OutletInterface, OutletGetQueryInterface } from 'interfaces/outlet';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getOutlets = async (query?: OutletGetQueryInterface): Promise<PaginatedInterface<OutletInterface>> => {
  const response = await axios.get('/api/outlets', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createOutlet = async (outlet: OutletInterface) => {
  const response = await axios.post('/api/outlets', outlet);
  return response.data;
};

export const updateOutletById = async (id: string, outlet: OutletInterface) => {
  const response = await axios.put(`/api/outlets/${id}`, outlet);
  return response.data;
};

export const getOutletById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/outlets/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOutletById = async (id: string) => {
  const response = await axios.delete(`/api/outlets/${id}`);
  return response.data;
};
