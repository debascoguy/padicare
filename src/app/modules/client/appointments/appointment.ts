import { User, UserAddress } from "@app/core/models/user";
import { ProductsNameEnum } from "@app/shared/enums/products-name.enum";
import { CaregiverFees } from "@app/shared/types/caregiver-fees";

export interface BookAppointment {

    id: string;

    productName: ProductsNameEnum;

    caregiverFees: CaregiverFees;

    appointmentDate: Date;

    appointmentTime: string; // Often stored as a string in 'HH:MM:SS' format

    caregiver: User;

    quantity: number;

    additionalNotes: string;

    serviceAddress: UserAddress;

    createdBy: User;

    isActive: boolean;
    
    createdAt: Date;
    
    updatedAt: Date;
}