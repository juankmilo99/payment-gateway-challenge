export class Customer {
  constructor(
    public readonly id: string,
    public email: string,
    public fullName: string,
    public phone?: string,
  ) {}
}
