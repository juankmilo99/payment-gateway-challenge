export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number, // In cents
    public stock: number,
  ) {}

  public hasStock(quantity: number = 1): boolean {
    return this.stock >= quantity;
  }

  public decreaseStock(quantity: number = 1): void {
    if (!this.hasStock(quantity)) {
      throw new Error('Not enough stock');
    }
    this.stock -= quantity;
  }
}
