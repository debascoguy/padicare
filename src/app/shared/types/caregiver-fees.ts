import { FeeFrequencyEnum } from "../enums/fee-frequency.enum";
import { ProductsNameEnum } from "../enums/products-name.enum";

export interface CaregiverFees {

  id: string;

  productName: ProductsNameEnum;

  amount: number;

  currency: string;

  frequency: FeeFrequencyEnum;

  createdAt: Date;

  updatedAt: Date;

  isDeleted: boolean;

}