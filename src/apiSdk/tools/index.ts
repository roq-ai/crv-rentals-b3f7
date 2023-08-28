import axios from 'axios';
import queryString from 'query-string';
import { ToolInterface, ToolGetQueryInterface } from 'interfaces/tool';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getTools = async (query?: ToolGetQueryInterface): Promise<PaginatedInterface<ToolInterface>> => {
  const response = await axios.get('/api/tools', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createTool = async (tool: ToolInterface) => {
  const response = await axios.post('/api/tools', tool);
  return response.data;
};

export const updateToolById = async (id: string, tool: ToolInterface) => {
  const response = await axios.put(`/api/tools/${id}`, tool);
  return response.data;
};

export const getToolById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/tools/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteToolById = async (id: string) => {
  const response = await axios.delete(`/api/tools/${id}`);
  return response.data;
};
