import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../../domain/transaction/ITransactionRepository';
import { Transaction, TransactionStatus } from '../../../domain/transaction/Transaction';
import { PrismaService } from './PrismaService';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.create({
      data: {
        id: transaction.id,
        productId: transaction.productId,
        amount: transaction.amount,
        baseFee: transaction.baseFee,
        deliveryFee: transaction.deliveryFee,
        totalAmount: transaction.totalAmount,
        status: transaction.status as any,
        customerId: transaction.customerId,
        providerReference: transaction.providerReference,
      }
    });
  }

  async findById(id: string): Promise<Transaction | null> {
    const raw = await this.prisma.transaction.findUnique({ where: { id } });
    if (!raw) return null;
    return new Transaction(
      raw.id,
      raw.productId,
      raw.amount,
      raw.baseFee,
      raw.deliveryFee,
      raw.status as TransactionStatus,
      raw.customerId || undefined,
      raw.providerReference || undefined
    );
  }

  async update(transaction: Transaction): Promise<void> {
    await this.prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: transaction.status as any,
        providerReference: transaction.providerReference,
      }
    });
  }
}
