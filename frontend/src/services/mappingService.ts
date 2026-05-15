import axios from '@/lib/axios';
import { Mapping } from '@/types';

const unwrapResponse = (response: any) => response?.data ?? response;
const unwrapPayload = (response: any) => {
  const unwrapped = unwrapResponse(response);
  return unwrapped?.data ?? unwrapped;
};

export const mappingService = {
  assignTenant: async (data: {
    tenantId: number;
    flatId: number;
    agreementStartDate: string;
    agreementEndDate: string;
  }): Promise<Mapping> => {
    const response = await axios.post('/mappings/assign', data);
    return unwrapPayload(response);
  },

  removeMapping: async (id: number): Promise<void> => {
    await axios.delete(`/mappings/${id}`);
  },

  getMappingByFlat: async (flatId: number): Promise<Mapping> => {
    const response = await axios.get(`/mappings/flat/${flatId}`);
    return unwrapPayload(response);
  },

  getMappingByTenant: async (tenantId: number): Promise<Mapping> => {
    const response = await axios.get(`/mappings/tenant/${tenantId}`);
    return unwrapPayload(response);
  }
};
