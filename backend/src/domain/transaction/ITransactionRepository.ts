import { Transaction } from './Transaction';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<void>;
  findById(id: string): Promise<Transaction | null>;
  update(transaction: Transaction): Promise<void>;
}
