export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ERROR = 'ERROR'
}

export class Transaction {
  constructor(
    public readonly id: string,
    public productId: string,
    public amount: number, // cents
    public baseFee: number, // cents
    public deliveryFee: number, // cents
    public status: TransactionStatus = TransactionStatus.PENDING,
    public customerId?: string,
    public providerReference?: string,
  ) {}

  get totalAmount(): number {
    return this.amount + this.baseFee + this.deliveryFee;
  }

  public approve(providerReference: string): void {
    this.status = TransactionStatus.APPROVED;
    this.providerReference = providerReference;
  }

  public reject(providerReference?: string): void {
    this.status = TransactionStatus.REJECTED;
    if (providerReference) {
      this.providerReference = providerReference;
    }
  }
  
  public markAsError(): void {
    this.status = TransactionStatus.ERROR;
  }
}
