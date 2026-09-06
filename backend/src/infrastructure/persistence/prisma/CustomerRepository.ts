import { Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../../../domain/customer/ICustomerRepository';
import { Customer } from '../../../domain/customer/Customer';
import { PrismaService } from './PrismaService';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(customer: Customer): Promise<void> {
    await this.prisma.customer.create({
      data: {
        id: customer.id,
        email: customer.email,
        fullName: customer.fullName,
        phone: customer.phone,
      }
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const raw = await this.prisma.customer.findUnique({ where: { email } });
    if (!raw) return null;
    return new Customer(raw.id, raw.email, raw.fullName, raw.phone || undefined);
  }

  async findById(id: string): Promise<Customer | null> {
    const raw = await this.prisma.customer.findUnique({ where: { id } });
    if (!raw) return null;
    return new Customer(raw.id, raw.email, raw.fullName, raw.phone || undefined);
  }
}
