export interface PaymentRequest {
  amount: number;
  cardNumber: string; // Tokenized or raw depending on what PSP supports (usually should be a token, but for this challenge we simulate it)
  expMonth: string;
  expYear: string;
  cvc: string;
  cardHolder: string;
}

export enum PaymentStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ERROR = 'ERROR'
}

export interface PaymentResponse {
  status: PaymentStatus;
  providerReference?: string;
  errorMessage?: string;
}

export interface IPaymentProvider {
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
}
