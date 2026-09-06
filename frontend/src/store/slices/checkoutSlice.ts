import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CheckoutState {
  productId: string | null;
  productPrice: number;
  productName: string;
  customer: {
    email: string;
    fullName: string;
    phone: string;
  };
  delivery: {
    address: string;
    city: string;
    region: string;
    zipCode: string;
  };
  payment: {
    cardNumber: string; // Only stored temporarily during flow
    expMonth: string;
    expYear: string;
    cvc: string;
    cardHolder: string;
  };
  transactionResult: {
    id: string;
    status: string;
    providerReference?: string;
  } | null;
}

const initialState: CheckoutState = {
  productId: null,
  productPrice: 0,
  productName: '',
  customer: { email: '', fullName: '', phone: '' },
  delivery: { address: '', city: '', region: '', zipCode: '' },
  payment: { cardNumber: '', expMonth: '', expYear: '', cvc: '', cardHolder: '' },
  transactionResult: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<{ id: string; price: number; name: string }>) => {
      state.productId = action.payload.id;
      state.productPrice = action.payload.price;
      state.productName = action.payload.name;
    },
    updateCustomer: (state, action: PayloadAction<Partial<CheckoutState['customer']>>) => {
      state.customer = { ...state.customer, ...action.payload };
    },
    updateDelivery: (state, action: PayloadAction<Partial<CheckoutState['delivery']>>) => {
      state.delivery = { ...state.delivery, ...action.payload };
    },
    updatePayment: (state, action: PayloadAction<Partial<CheckoutState['payment']>>) => {
      state.payment = { ...state.payment, ...action.payload };
    },
    setTransactionResult: (state, action: PayloadAction<CheckoutState['transactionResult']>) => {
      state.transactionResult = action.payload;
    },
    clearSensitiveData: (state) => {
      state.payment = initialState.payment;
    },
    resetCheckout: () => initialState,
  },
});

export const {
  setProduct,
  updateCustomer,
  updateDelivery,
  updatePayment,
  setTransactionResult,
  clearSensitiveData,
  resetCheckout,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
