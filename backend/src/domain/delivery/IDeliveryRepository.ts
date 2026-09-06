import { Delivery } from './Delivery';

export interface IDeliveryRepository {
  create(delivery: Delivery): Promise<void>;
  findByTransactionId(transactionId: string): Promise<Delivery | null>;
}
