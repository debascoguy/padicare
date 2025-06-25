import { BillingPeriodEnum } from "../enums/billing-period.enum";
import { ProductsNameEnum } from "../enums/products-name.enum";
import { SecondaryCareType } from "../enums/secondary.care.type";

export interface ProductsPrices {

  id: string;

  productName: ProductsNameEnum;

  careType: SecondaryCareType;

  billingPeriod: BillingPeriodEnum;

  billingPeriodDetails: string;

  price: number;

  currency: string;

  paymentPriceId: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

}