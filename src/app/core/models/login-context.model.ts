import { User } from "./user";

export interface LoginContext {
    authorities: string[];
    token: string;
    refreshToken: string;
    user: User;
    profileImage?: any;
    clientPreferences?: any;
    [key: string]: any;
}
