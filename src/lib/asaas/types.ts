
// Type definitions for Asaas API

export type CustomerData = {
  name: string;
  cpfCnpj: string;
  email: string;
  mobilePhone: string;
};

export type CustomerResponse = {
  id: string;
  name: string;
  cpfCnpj: string;
  email: string;
  mobilePhone: string;
  [key: string]: any;
};

export type SubscriptionData = {
  customer: string;
  plan: string;
};

export type SubscriptionResponse = {
  id: string;
  customer: string;
  value: number;
  nextDueDate: string;
  [key: string]: any;
};

export type InstallmentData = {
  customer: string;
  plan: string;
  installmentCount: number;
};

export type InstallmentResponse = {
  id: string;
  customer: string;
  installmentCount: number;
  value: number;
  [key: string]: any;
};

export type InvoiceUrlData = {
  id: string;
  type: "subscription" | "installment";
};

export type PaymentResponse = {
  id: string;
  customer: string;
  invoiceUrl: string;
  [key: string]: any;
};
