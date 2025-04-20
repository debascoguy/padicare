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
  appRoles?: [];
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
  radius?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}
