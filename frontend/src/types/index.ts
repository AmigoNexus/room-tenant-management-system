export type Role = 'OWNER' | 'TENANT';

export interface User {
  id: string;
  fullName?: string;
  name?: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Property {
  id: string | number;
  propertyName: string;
  address: string;
  ownerId: string | number;
  wings?: Wing[];
  floors?: Floor[];
  flats?: Flat[];
  wingsCount?: number;
  floorCount?: number;
  flatCount?: number;
}

export interface PropertyDetails extends Property {
  wings?: Wing[];
  floors?: Floor[];
  flats?: Flat[];
}

export interface Floor {
  id: string | number;
  propertyId: string | number;
  wingId: string | number;
  floorName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string | null;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Wing {
  id: string | number;
  propertyId: string | number;
  wingName: string;
}

export interface Flat {
  id: string | number;
  floorId: string | number;
  flatNumber: string;
  rentAmount: number;
  depositAmount: number;
  maintenanceAmount: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  flatType?: string;
  notes?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaar?: string;
  occupation?: string;
  joiningDate: string;
  avatar?: string;
}

export interface Mapping {
  id: string;
  tenantId: string;
  flatId: string;
  startDate: string;
  endDate?: string;
  rentAmount: number;
  depositAmount: number;
}

export interface Payment {
  id: string;
  mappingId: string;
  month: string; // YYYY-MM
  rentAmount: number;
  depositAmount?: number;
  totalAmount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidDate?: string;
  notes?: string;
  screenshot?: string;
}
