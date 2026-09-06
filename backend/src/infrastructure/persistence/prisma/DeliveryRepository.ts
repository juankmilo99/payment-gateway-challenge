import { Injectable } from '@nestjs/common';
import { IDeliveryRepository } from '../../../domain/delivery/IDeliveryRepository';
import { Delivery, DeliveryStatus } from '../../../domain/delivery/Delivery';
import { PrismaService } from './PrismaService';

@Injectable()
export class DeliveryRepository implements IDeliveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(delivery: Delivery): Promise<void> {
    await this.prisma.delivery.create({
      data: {
        id: delivery.id,
        transactionId: delivery.transactionId,
        address: delivery.address,
        city: delivery.city,
        region: delivery.region,
        zipCode: delivery.zipCode,
        status: delivery.status as any,
      }
    });
  }

  async findByTransactionId(transactionId: string): Promise<Delivery | null> {
    const raw = await this.prisma.delivery.findUnique({ where: { transactionId } });
    if (!raw) return null;
    return new Delivery(
      raw.id,
      raw.transactionId,
      raw.address,
      raw.city,
      raw.region || undefined,
      raw.zipCode || undefined,
      raw.status as DeliveryStatus
    );
  }
}
