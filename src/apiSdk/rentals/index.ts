import axios from 'axios';
import queryString from 'query-string';
import { RentalInterface, RentalGetQueryInterface } from 'interfaces/rental';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getRentals = async (query?: RentalGetQueryInterface): Promise<PaginatedInterface<RentalInterface>> => {
  const response = await axios.get('/api/rentals', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createRental = async (rental: RentalInterface) => {
  const response = await axios.post('/api/rentals', rental);
  return response.data;
};

export const updateRentalById = async (id: string, rental: RentalInterface) => {
  const response = await axios.put(`/api/rentals/${id}`, rental);
  return response.data;
};

export const getRentalById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/rentals/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRentalById = async (id: string) => {
  const response = await axios.delete(`/api/rentals/${id}`);
  return response.data;
};
