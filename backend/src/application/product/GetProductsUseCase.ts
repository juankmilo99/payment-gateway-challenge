import { IProductRepository } from '../../domain/product/IProductRepository';
import { Product } from '../../domain/product/Product';
import { Result } from '../../domain/shared/Result';
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository
  ) {}

  async execute(): Promise<Result<Product[]>> {
    try {
      const products = await this.productRepository.findAll();
      return Result.ok(products);
    } catch (error) {
      return Result.fail('Failed to fetch products');
    }
  }
}
