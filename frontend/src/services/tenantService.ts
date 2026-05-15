import axios from '@/lib/axios';
import { Tenant } from '@/types';

const unwrapResponse = (response: any) => response?.data ?? response;
const unwrapPayload = (response: any) => {
  const unwrapped = unwrapResponse(response);
  return unwrapped?.data ?? unwrapped;
};

export const tenantService = {
  getTenants: async (): Promise<Tenant[]> => {
    const response = await axios.get('/tenants');
    return unwrapPayload(response) || [];
  },

  getTenant: async (id: number): Promise<Tenant> => {
    const response = await axios.get(`/tenants/${id}`);
    return unwrapPayload(response);
  },

  createTenant: async (tenantData: any): Promise<Tenant> => {
    const response = await axios.post('/tenants', tenantData);
    return unwrapPayload(response);
  },

  updateTenant: async (id: number, tenantData: any): Promise<Tenant> => {
    const response = await axios.put(`/tenants/${id}`, tenantData);
    return unwrapPayload(response);
  },

  deleteTenant: async (id: number): Promise<void> => {
    await axios.delete(`/tenants/${id}`);
  }
};
