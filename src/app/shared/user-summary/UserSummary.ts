import { ProductsNameEnum } from "../enums/products-name.enum";

export interface CareTypes {
  id: string;
  product_name: ProductsNameEnum | string;
  category: string;
}

export interface UserSummary {

  userId: string;

  email: string;

  firstName: string;

  lastName: string;

  profileImage: string;

  userAddressCity: string;

  userAddressState: string;

  professionalSummary: string;

  reviewText: string;

  userRating: number;

  yearsOfExperience: number;

  caregiverCareTypes?: CareTypes[]; // Optional field for caregiver care types

}
