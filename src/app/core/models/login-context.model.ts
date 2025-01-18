import { User } from "./user";

export interface LoginContext {
    id: string;
    authorities: string[];
    token: string;
    refreshToken: string;
    user: User;
    profileImage: any;
    [key: string]: any;
}
