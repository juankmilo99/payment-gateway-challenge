import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../../../domain/product/IProductRepository';
import { Product } from '../../../domain/product/Product';
import { PrismaService } from './PrismaService';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const raw = await this.prisma.product.findUnique({ where: { id } });
    if (!raw) return null;
    return new Product(raw.id, raw.name, raw.description, raw.price, raw.stock);
  }

  async findAll(): Promise<Product[]> {
    const rawList = await this.prisma.product.findMany();
    return rawList.map(raw => new Product(raw.id, raw.name, raw.description, raw.price, raw.stock));
  }

  async update(product: Product): Promise<void> {
    await this.prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      }
    });
  }
}
