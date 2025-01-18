export interface User {
  id: number;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
  sourceDirectory: string;
  userType: string;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
