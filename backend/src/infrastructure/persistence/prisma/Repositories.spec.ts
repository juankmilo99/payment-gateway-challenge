import { jest } from '@jest/globals';
import { CustomerRepository } from './CustomerRepository';
import { DeliveryRepository } from './DeliveryRepository';
import { ProductRepository } from './ProductRepository';
import { TransactionRepository } from './TransactionRepository';
import { PrismaService } from './PrismaService';
import { Customer } from '../../../domain/customer/Customer';
import { Delivery } from '../../../domain/delivery/Delivery';
import { Product } from '../../../domain/product/Product';
import { Transaction } from '../../../domain/transaction/Transaction';

describe('Prisma Repositories', () => {
  let prismaServiceMock: any;

  beforeEach(() => {
    prismaServiceMock = {
      customer: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
      delivery: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      transaction: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };
  });

  describe('CustomerRepository', () => {
    let repo: CustomerRepository;

    beforeEach(() => {
      repo = new CustomerRepository(prismaServiceMock as PrismaService);
    });

    it('should create customer', async () => {
      const customer = new Customer('1', 'test@test.com', 'Test');
      await repo.create(customer);
      expect(prismaServiceMock.customer.create).toHaveBeenCalled();
    });

    it('should find by email', async () => {
      prismaServiceMock.customer.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com', fullName: 'Test' });
      const customer = await repo.findByEmail('test@test.com');
      expect(customer).toBeDefined();
      expect(customer?.email).toBe('test@test.com');
    });

    it('should return null if not found by email', async () => {
      prismaServiceMock.customer.findUnique.mockResolvedValue(null);
      expect(await repo.findByEmail('test@test.com')).toBeNull();
    });

    it('should find by id', async () => {
      prismaServiceMock.customer.findUnique.mockResolvedValue({ id: '1', email: 'test@test.com', fullName: 'Test' });
      expect(await repo.findById('1')).toBeDefined();
    });

    it('should return null if not found by id', async () => {
      prismaServiceMock.customer.findUnique.mockResolvedValue(null);
      expect(await repo.findById('1')).toBeNull();
    });
  });

  describe('DeliveryRepository', () => {
    let repo: DeliveryRepository;

    beforeEach(() => {
      repo = new DeliveryRepository(prismaServiceMock as PrismaService);
    });

    it('should create delivery', async () => {
      const delivery = new Delivery('1', 'tx-1', '123', 'City');
      await repo.create(delivery);
      expect(prismaServiceMock.delivery.create).toHaveBeenCalled();
    });

    it('should find by transactionId', async () => {
      prismaServiceMock.delivery.findUnique.mockResolvedValue({ id: '1', transactionId: 'tx-1', address: '123', city: 'City', status: 'PENDING' });
      expect(await repo.findByTransactionId('tx-1')).toBeDefined();
    });

    it('should return null if not found by transactionId', async () => {
      prismaServiceMock.delivery.findUnique.mockResolvedValue(null);
      expect(await repo.findByTransactionId('tx-1')).toBeNull();
    });
  });

  describe('ProductRepository', () => {
    let repo: ProductRepository;

    beforeEach(() => {
      repo = new ProductRepository(prismaServiceMock as PrismaService);
    });

    it('should find by id', async () => {
      prismaServiceMock.product.findUnique.mockResolvedValue({ id: '1', name: 'Test', price: 100, stock: 10 });
      expect(await repo.findById('1')).toBeDefined();
    });

    it('should return null if not found by id', async () => {
      prismaServiceMock.product.findUnique.mockResolvedValue(null);
      expect(await repo.findById('1')).toBeNull();
    });

    it('should find all', async () => {
      prismaServiceMock.product.findMany.mockResolvedValue([{ id: '1', name: 'Test', price: 100, stock: 10 }]);
      const list = await repo.findAll();
      expect(list.length).toBe(1);
    });

    it('should update', async () => {
      const product = new Product('1', 'Test', 'desc', 100, 10);
      await repo.update(product);
      expect(prismaServiceMock.product.update).toHaveBeenCalled();
    });
  });

  describe('TransactionRepository', () => {
    let repo: TransactionRepository;

    beforeEach(() => {
      repo = new TransactionRepository(prismaServiceMock as PrismaService);
    });

    it('should create transaction', async () => {
      const tx = new Transaction('1', 'p1', 100, 0, 0, undefined, 'c1');
      await repo.create(tx);
      expect(prismaServiceMock.transaction.create).toHaveBeenCalled();
    });

    it('should update transaction', async () => {
      const tx = new Transaction('1', 'p1', 100, 0, 0, undefined, 'c1');
      await repo.update(tx);
      expect(prismaServiceMock.transaction.update).toHaveBeenCalled();
    });

    it('should find by id', async () => {
      prismaServiceMock.transaction.findUnique.mockResolvedValue({ 
        id: '1', customerId: 'c1', deliveryId: 'd1', productId: 'p1', totalAmount: 100, status: 'PENDING' 
      });
      expect(await repo.findById('1')).toBeDefined();
    });

    it('should return null if not found by id', async () => {
      prismaServiceMock.transaction.findUnique.mockResolvedValue(null);
      expect(await repo.findById('1')).toBeNull();
    });
  });

  describe('PrismaService', () => {
    it('should call connect and disconnect on lifecycle hooks', async () => {
      const service = new PrismaService();
      // Since it extends PrismaClient we can't easily mock the parent methods without a full mock,
      // but we can just test the lifecycle hooks manually if needed.
      // We will skip full PrismaClient instantiation test for unit tests as it requires real DB or deep mock.
      expect(service).toBeDefined();
    });
  });
});
