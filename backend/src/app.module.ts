import { Module } from '@nestjs/common';
import { ProductController, TransactionController } from './infrastructure/http/Controllers';
import { GetProductsUseCase } from './application/product/GetProductsUseCase';
import { ProcessPaymentUseCase } from './application/transaction/ProcessPaymentUseCase';
import { PrismaService } from './infrastructure/persistence/prisma/PrismaService';
import { ProductRepository } from './infrastructure/persistence/prisma/ProductRepository';
import { TransactionRepository } from './infrastructure/persistence/prisma/TransactionRepository';
import { CustomerRepository } from './infrastructure/persistence/prisma/CustomerRepository';
import { DeliveryRepository } from './infrastructure/persistence/prisma/DeliveryRepository';
import { MockPaymentProvider } from './infrastructure/payment/MockPaymentProvider';

@Module({
  imports: [],
  controllers: [ProductController, TransactionController],
  providers: [
    PrismaService,
    { provide: 'IProductRepository', useClass: ProductRepository },
    { provide: 'ITransactionRepository', useClass: TransactionRepository },
    { provide: 'ICustomerRepository', useClass: CustomerRepository },
    { provide: 'IDeliveryRepository', useClass: DeliveryRepository },
    { provide: 'IPaymentProvider', useClass: MockPaymentProvider },
    GetProductsUseCase,
    ProcessPaymentUseCase,
  ],
})
export class AppModule {}
