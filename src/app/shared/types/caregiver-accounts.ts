import { User } from "@app/core/models/user";

export interface CaregiverAccounts {

  id: string;

  caregiver?: User;

  available: number;

  incoming_credit: number;

  outgoing_debit: number;

  currency: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

  createdBy?: User;

}
