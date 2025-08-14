
export enum PaymentStatus {
  CREATED = "CREATED",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  REFUNDED = "REFUNDED"
}

export interface InvoicesLineItems {
  id: string;
  invoice_id: string; // Invoice ID
  description: string;
  unit: string;
  quantity: number;
  amount: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  totalQuantity: number;
  currency: string;
  isActive: boolean;
  id: string;
  invoiceNumber: string;
  productName: string;
  sessionId: string;
  checkoutEntity: string;
  checkoutEntityId: string;
  totalAmount: number;
  dueDate: Date | null;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  invoiceslineItems?: InvoicesLineItems[];
}