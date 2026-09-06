import { describe, it, expect } from 'vitest';
import reducer, { setProduct, updateCustomer, clearSensitiveData, updateDelivery, updatePayment, setTransactionResult, resetCheckout } from './checkoutSlice';

describe('checkoutSlice', () => {
  const initialState = {
    productId: null,
    productPrice: 0,
    productName: '',
    customer: { email: '', fullName: '', phone: '' },
    delivery: { address: '', city: '', region: '', zipCode: '' },
    payment: { cardNumber: '', expMonth: '', expYear: '', cvc: '', cardHolder: '' },
    transactionResult: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setProduct', () => {
    const actual = reducer(initialState, setProduct({ id: '1', price: 1000, name: 'Test' }));
    expect(actual.productId).toEqual('1');
    expect(actual.productPrice).toEqual(1000);
    expect(actual.productName).toEqual('Test');
  });

  it('should handle updateCustomer', () => {
    const actual = reducer(initialState, updateCustomer({ email: 'test@test.com' }));
    expect(actual.customer.email).toEqual('test@test.com');
  });

  it('should handle clearSensitiveData', () => {
    const stateWithPayment = {
      ...initialState,
      payment: { cardNumber: '123', expMonth: '12', expYear: '25', cvc: '123', cardHolder: 'Test' }
    };
    const actual = reducer(stateWithPayment, clearSensitiveData());
    expect(actual.payment.cardNumber).toEqual('');
    expect(actual.payment.cvc).toEqual('');
  });

  it('should handle updateDelivery and updatePayment', () => {
    let actual = reducer(initialState, updateDelivery({ city: 'Bogota' }));
    expect(actual.delivery.city).toEqual('Bogota');

    actual = reducer(actual, updatePayment({ cardHolder: 'Juan' }));
    expect(actual.payment.cardHolder).toEqual('Juan');
  });

  it('should handle setTransactionResult and resetCheckout', () => {
    let actual = reducer(initialState, setTransactionResult({ id: '1', status: 'APPROVED' }));
    expect(actual.transactionResult?.status).toEqual('APPROVED');

    actual = reducer(actual, resetCheckout());
    expect(actual).toEqual(initialState);
  });
});
