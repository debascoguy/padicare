import { DayOfWeekEnum, SeasonOfDay } from '@app/shared/enums/schedules.enum';
import { AppUserType } from '../../shared/enums/app.user.type.enum';
import { User, UserAddress } from "./user";
import { CaregiverQualities } from '@app/shared/enums/caregiver.qualities.enum';

export interface ClientPreferences {
  id?: string;
  clientId?: string;
  careStartDate?: Date;
  careEndDate?: Date;
  isFlexibleStartDate?: boolean;
  dayOfWeek?: DayOfWeekEnum[];
  timeOfDay?: SeasonOfDay[];
  specificTimeOfDay?: string | null; //HH:mm:ss
  isFlexibleSchedule?: boolean;
  caregiverQualities?: CaregiverQualities[] | string[];
  payRangeFrom?: number;
  payRangeTo?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  additionalComments?: string;
}

export interface CaregiverPreferences {
  id?: string;
  yearsOfExperience?: number;
  professionalSummary?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  caregiverId?: string;
  [key: string]: any;
}

export interface UserPreference {
  acceptTermsAndConditions: boolean;
  acceptNotifications: boolean;
  acceptLocation: boolean;
  acceptEmail: boolean;
  acceptSMS: boolean;
  acceptPhone: boolean;
  visibility: boolean;
  careReadiness: any;
  [key: string]: any;
}


export interface LoginContext {
  authorities: string[];
  token: string;
  refreshToken: string;
  user: User;
  profileImage?: any;
  userAddress?: UserAddress;
  userPreferences?: UserPreference;
  clientOrCaregiverPreferences?: ClientPreferences | CaregiverPreferences;
  activePortal?: AppUserType;
  [key: string]: any;
}
