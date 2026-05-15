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
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  idProof: string;
  profileImage: string;
  active: boolean;
  createdAt: string;
  assignedFlatNumber?: string;
  assignedMappingId?: number;
}

export interface Mapping {
  id: number;
  tenantId: number;
  tenantName: string;
  flatId: number;
  flatNumber: string;
  agreementStartDate: string;
  agreementEndDate: string;
  active: boolean;
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
