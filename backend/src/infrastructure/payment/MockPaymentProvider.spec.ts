import { MockPaymentProvider } from './MockPaymentProvider';
import { PaymentStatus } from '../../domain/payment/IPaymentProvider';

describe('MockPaymentProvider', () => {
  let provider: MockPaymentProvider;

  beforeEach(() => {
    provider = new MockPaymentProvider();
  });

  it('should reject short card numbers', async () => {
    const result = await provider.processPayment({
      amount: 100,
      cardNumber: '1234',
      cvc: '123',
      expMonth: '12',
      expYear: '25',
      cardHolder: 'Test'
    });
    
    expect(result.status).toBe(PaymentStatus.REJECTED);
    expect(result.errorMessage).toBe('Invalid card number length');
  });

  it('should reject card ending in 0000', async () => {
    const result = await provider.processPayment({
      amount: 100,
      cardNumber: '4111111111110000',
      cvc: '123',
      expMonth: '12',
      expYear: '25',
      cardHolder: 'Test'
    });
    
    expect(result.status).toBe(PaymentStatus.REJECTED);
    expect(result.errorMessage).toBe('Card declined by issuing bank');
    expect(result.providerReference).toBeDefined();
  });

  it('should return error for card ending in 9999', async () => {
    const result = await provider.processPayment({
      amount: 100,
      cardNumber: '4111111111119999',
      cvc: '123',
      expMonth: '12',
      expYear: '25',
      cardHolder: 'Test'
    });
    
    expect(result.status).toBe(PaymentStatus.ERROR);
    expect(result.errorMessage).toBe('Provider connection timeout');
  });

  it('should approve valid cards', async () => {
    const result = await provider.processPayment({
      amount: 100,
      cardNumber: '4111111111111111',
      cvc: '123',
      expMonth: '12',
      expYear: '25',
      cardHolder: 'Test'
    });
    
    expect(result.status).toBe(PaymentStatus.APPROVED);
    expect(result.providerReference).toBeDefined();
  });
});
