import { AppUserType } from './../../enums/app.user.type.enum';
import { User } from "./user";

export interface LoginContext {
    authorities: string[];
    token: string;
    refreshToken: string;
    user: User;
    profileImage?: any;
    userAddress?: any;
    userPreferences?: any;
    clientPreferences?: any;
    activePortal?: AppUserType;
    [key: string]: any;
}
