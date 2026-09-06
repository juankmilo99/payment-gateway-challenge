export enum DeliveryStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED'
}

export class Delivery {
  constructor(
    public readonly id: string,
    public transactionId: string,
    public address: string,
    public city: string,
    public region?: string,
    public zipCode?: string,
    public status: DeliveryStatus = DeliveryStatus.PENDING,
  ) {}
}
