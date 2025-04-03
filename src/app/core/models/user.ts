export interface User {
  id: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  cellPhone?: string;
  sourceDirectory?: string;
  userType: string;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAddress {
  id?: string;
  user?: User;
  zipcode?: string;
  latitude?: number;
  longitude?: number;
  houseNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}
