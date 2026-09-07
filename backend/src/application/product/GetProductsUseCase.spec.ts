import { jest } from '@jest/globals';
import { GetProductsUseCase } from './GetProductsUseCase';
import { IProductRepository } from '../../domain/product/IProductRepository';
import { Product } from '../../domain/product/Product';

describe('GetProductsUseCase', () => {
  let getProductsUseCase: GetProductsUseCase;
  let productRepositoryMock: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    productRepositoryMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
      updateStock: jest.fn(),
    };
    getProductsUseCase = new GetProductsUseCase(productRepositoryMock);
  });

  it('should return products on success', async () => {
    const products = [new Product('1', 'Test', 'Test', 100, 10)];
    productRepositoryMock.findAll.mockResolvedValue(products);

    const result = await getProductsUseCase.execute();
    
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual(products);
    expect(productRepositoryMock.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return failure result on repository error', async () => {
    productRepositoryMock.findAll.mockRejectedValue(new Error('DB Connection Error'));

    const result = await getProductsUseCase.execute();
    
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Failed to fetch products');
  });
});
