export interface ProcessPaymentDTO {
  productId: string;
  customer: {
    email: string;
    fullName: string;
    phone?: string;
  };
  delivery: {
    address: string;
    city: string;
    region?: string;
    zipCode?: string;
  };
  payment: {
    cardNumber: string;
    expMonth: string;
    expYear: string;
    cvc: string;
    cardHolder: string;
  };
}
