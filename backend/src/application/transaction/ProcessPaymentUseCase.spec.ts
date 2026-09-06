import { ProcessPaymentUseCase } from './ProcessPaymentUseCase';
import { Product } from '../../domain/product/Product';
import { Customer } from '../../domain/customer/Customer';
import { Transaction, TransactionStatus } from '../../domain/transaction/Transaction';
import { PaymentStatus } from '../../domain/payment/IPaymentProvider';

import { vi } from 'vitest';

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
  let productRepo: any;
  let transactionRepo: any;
  let customerRepo: any;
  let deliveryRepo: any;
  let paymentProvider: any;

  beforeEach(() => {
    productRepo = { findById: vi.fn(), update: vi.fn() };
    transactionRepo = { create: vi.fn(), update: vi.fn() };
    customerRepo = { findByEmail: vi.fn(), create: vi.fn() };
    deliveryRepo = { create: vi.fn() };
    paymentProvider = { processPayment: vi.fn() };

    useCase = new ProcessPaymentUseCase(
      productRepo,
      transactionRepo,
      customerRepo,
      deliveryRepo,
      paymentProvider
    );
  });

  const getValidDto = () => ({
    productId: 'prod-1',
    customer: { email: 'test@test.com', fullName: 'Test User' },
    delivery: { address: '123 Main St', city: 'Test City' },
    payment: { cardNumber: '4111111111111', expMonth: '12', expYear: '25', cvc: '123', cardHolder: 'Test User' },
  });

  it('should fail if product not found', async () => {
    productRepo.findById.mockResolvedValue(null);
    const result = await useCase.execute(getValidDto());
    
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Product not found');
  });

  it('should fail if product out of stock', async () => {
    const product = new Product('prod-1', 'Product', 'Desc', 1000, 0);
    productRepo.findById.mockResolvedValue(product);
    
    const result = await useCase.execute(getValidDto());
    
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Product out of stock');
  });

  it('should successfully process a payment and update stock', async () => {
    const product = new Product('prod-1', 'Product', 'Desc', 1000, 10);
    productRepo.findById.mockResolvedValue(product);
    customerRepo.findByEmail.mockResolvedValue(null);
    paymentProvider.processPayment.mockResolvedValue({
      status: PaymentStatus.APPROVED,
      providerReference: 'TXN_123'
    });

    const result = await useCase.execute(getValidDto());

    expect(result.isSuccess).toBe(true);
    const tx = result.getValue();
    expect(tx.status).toBe(TransactionStatus.APPROVED);
    expect(tx.providerReference).toBe('TXN_123');
    expect(product.stock).toBe(9); // Stock reduced
    expect(productRepo.update).toHaveBeenCalled();
    expect(transactionRepo.create).toHaveBeenCalled();
    expect(transactionRepo.update).toHaveBeenCalled();
    expect(deliveryRepo.create).toHaveBeenCalled();
  });

  it('should handle payment rejection', async () => {
    const product = new Product('prod-1', 'Product', 'Desc', 1000, 10);
    productRepo.findById.mockResolvedValue(product);
    customerRepo.findByEmail.mockResolvedValue(new Customer('c-1', 'test@test.com', 'Test User'));
    paymentProvider.processPayment.mockResolvedValue({
      status: PaymentStatus.REJECTED,
      providerReference: 'REJ_123',
      errorMessage: 'Declined'
    });

    const result = await useCase.execute(getValidDto());

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Declined');
    expect(transactionRepo.update).toHaveBeenCalledWith(expect.objectContaining({ status: TransactionStatus.REJECTED }));
    expect(product.stock).toBe(10); // Stock NOT reduced
    expect(deliveryRepo.create).not.toHaveBeenCalled();
  });
});
