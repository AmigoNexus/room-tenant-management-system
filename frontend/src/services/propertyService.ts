import axios from '@/lib/axios';
import { Property, PropertyDetails, Wing, Flat, Floor } from '@/types';

const unwrapResponse = (response: any) => response?.data ?? response;
const unwrapPayload = (response: any) => {
  const unwrapped = unwrapResponse(response);
  return unwrapped?.data ?? unwrapped;
};

export const propertyService = {
  getProperties: async (): Promise<Property[]> => {
    const response = await axios.get('/properties');
    const payload = unwrapPayload(response);

    if (Array.isArray(payload)) {
      return payload;
    }

    if (Array.isArray(payload?.content)) {
      return payload.content;
    }

    if (Array.isArray(payload?.data)) {
      return payload.data;
    }

    if (Array.isArray(payload?.properties)) {
      return payload.properties;
    }

    return [];
  },

  getProperty: async (id: string): Promise<PropertyDetails> => {
    const response = await axios.get(`/properties/${id}`);
    return unwrapPayload(response);
  },

  getWings: async (propertyId: string): Promise<Wing[]> => {
    const response = await axios.get(`/properties/${propertyId}/wings`);
    return unwrapPayload(response);
  },

  getFloors: async (wingId: string | number): Promise<Floor[]> => {
    const response = await axios.get(`/properties/wings/${wingId}/floors`);
    return unwrapPayload(response);
  },

  getFlatsByFloor: async (floorId: string | number): Promise<Flat[]> => {
    const response = await axios.get(`/properties/floors/${floorId}/flats`);
    return unwrapPayload(response);
  },

  addProperty: async (property: { propertyName: string; address: string }) => {
    const response = await axios.post('/properties', property);
    return unwrapPayload(response);
  },

  addWing: async (wing: { wingName: string; propertyId: string }) => {
    const response = await axios.post('/properties/wings', wing);
    return unwrapPayload(response);
  },

  addFloor: async (floor: { floorName: string; propertyId: string; wingId: string }) => {
    const response = await axios.post('/properties/floors', floor);
    return unwrapPayload(response);
  },

  addFlat: async (flat: { 
    flatNumber: string;
    rentAmount: number;
    depositAmount: number;
    maintenanceAmount: number;
    status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
    floorId: string;
  }) => {
    const { floorId, ...payload } = flat;
    const response = await axios.post(`/properties/floors/${floorId}/flats`, payload);
    return unwrapPayload(response);
  }
};
