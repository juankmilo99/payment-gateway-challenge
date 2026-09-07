import { jest } from '@jest/globals';
import { ProductController, TransactionController } from './Controllers';
import { GetProductsUseCase } from '../../application/product/GetProductsUseCase';
import { ProcessPaymentUseCase } from '../../application/transaction/ProcessPaymentUseCase';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Result } from '../../domain/shared/Result';
import { Product } from '../../domain/product/Product';
import { Transaction } from '../../domain/transaction/Transaction';
import { PaymentRequestDto } from './dto/PaymentRequestDto';

describe('ProductController', () => {
  let productController: ProductController;
  let getProductsUseCaseMock: jest.Mocked<GetProductsUseCase>;

  beforeEach(() => {
    getProductsUseCaseMock = {
      execute: jest.fn(),
    } as any;
    productController = new ProductController(getProductsUseCaseMock);
  });

  it('should return products on success', async () => {
    const products = [
      new Product('1', 'Test', 'Test', 100, 10),
    ];
    getProductsUseCaseMock.execute.mockResolvedValue(Result.ok(products));

    const result = await productController.getProducts();
    expect(result).toEqual(products);
    expect(getProductsUseCaseMock.execute).toHaveBeenCalled();
  });

  it('should throw HttpException on failure', async () => {
    getProductsUseCaseMock.execute.mockResolvedValue(Result.fail('Database error'));

    await expect(productController.getProducts()).rejects.toThrow(HttpException);
    await expect(productController.getProducts()).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      response: 'Database error',
    });
  });
});

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let processPaymentUseCaseMock: jest.Mocked<ProcessPaymentUseCase>;

  beforeEach(() => {
    processPaymentUseCaseMock = {
      execute: jest.fn(),
    } as any;
    transactionController = new TransactionController(processPaymentUseCaseMock);
  });

  it('should return transaction dto on success', async () => {
    const transaction = new Transaction('1', 'prod-1', 1000, 0, 0, undefined, 'cust-1');

    
    transaction.approve('ref-123');
    processPaymentUseCaseMock.execute.mockResolvedValue(Result.ok(transaction));

    const result = await transactionController.createTransaction({} as PaymentRequestDto);
    
    expect(result).toEqual({
      id: transaction.id,
      status: 'APPROVED',
      totalAmount: 1000,
      providerReference: 'ref-123',
    });
  });

  it('should throw HttpException on business error', async () => {
    processPaymentUseCaseMock.execute.mockResolvedValue(Result.fail('Invalid card'));

    await expect(transactionController.createTransaction({} as PaymentRequestDto)).rejects.toThrow(HttpException);
    await expect(transactionController.createTransaction({} as PaymentRequestDto)).rejects.toMatchObject({
      status: HttpStatus.BAD_REQUEST,
      response: {
        message: 'Invalid card',
        status: 'FAILED',
      },
    });
  });
});
