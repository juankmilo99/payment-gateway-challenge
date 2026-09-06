import { Customer } from './Customer';

export interface ICustomerRepository {
  create(customer: Customer): Promise<void>;
  findByEmail(email: string): Promise<Customer | null>;
  findById(id: string): Promise<Customer | null>;
}
