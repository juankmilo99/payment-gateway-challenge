import { Injectable, Inject } from '@nestjs/common';
import * as crypto from 'crypto';
import { Result } from '../../domain/shared/Result';
import { ProcessPaymentDTO } from './ProcessPaymentDTO';
import type { IProductRepository } from '../../domain/product/IProductRepository';
import type { ITransactionRepository } from '../../domain/transaction/ITransactionRepository';
import type { ICustomerRepository } from '../../domain/customer/ICustomerRepository';
import type { IDeliveryRepository } from '../../domain/delivery/IDeliveryRepository';
import type { IPaymentProvider } from '../../domain/payment/IPaymentProvider';
import { PaymentStatus } from '../../domain/payment/IPaymentProvider';
import { Transaction, TransactionStatus } from '../../domain/transaction/Transaction';
import { Customer } from '../../domain/customer/Customer';
import { Delivery } from '../../domain/delivery/Delivery';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject('IProductRepository') private readonly productRepo: IProductRepository,
    @Inject('ITransactionRepository') private readonly transactionRepo: ITransactionRepository,
    @Inject('ICustomerRepository') private readonly customerRepo: ICustomerRepository,
    @Inject('IDeliveryRepository') private readonly deliveryRepo: IDeliveryRepository,
    @Inject('IPaymentProvider') private readonly paymentProvider: IPaymentProvider,
  ) {}

  async execute(dto: ProcessPaymentDTO): Promise<Result<Transaction>> {
    try {
      // 1. Validate Product & Stock
      const product = await this.productRepo.findById(dto.productId);
      if (!product) {
        return Result.fail('Product not found');
      }
      if (!product.hasStock(1)) {
        return Result.fail('Product out of stock');
      }

      // 2. Find or Create Customer
      let customer = await this.customerRepo.findByEmail(dto.customer.email);
      if (!customer) {
        customer = new Customer(uuidv4(), dto.customer.email, dto.customer.fullName, dto.customer.phone);
        await this.customerRepo.create(customer);
      }

      // 3. Create Transaction (PENDING)
      // Base fee and delivery fee could be calculated elsewhere, hardcoded for now as per requirements logic
      const baseFee = 1500; // $15.00 fixed
      const deliveryFee = 500; // $5.00 fixed
      const transaction = new Transaction(
        uuidv4(),
        product.id,
        product.price,
        baseFee,
        deliveryFee,
        TransactionStatus.PENDING,
        customer.id
      );
      await this.transactionRepo.create(transaction);

      // 3.5. Generate Integrity Signature (simulated)
      const integrityKey = process.env.PSP_INTEGRITY_KEY || 'default_test_key';
      const integrityString = `${transaction.id}${transaction.totalAmount}COP${integrityKey}`;
      const integritySignature = crypto.createHash('sha256').update(integrityString).digest('hex');

      // 4. Call Payment Provider
      const paymentResponse = await this.paymentProvider.processPayment({
        amount: transaction.totalAmount,
        cardNumber: dto.payment.cardNumber,
        expMonth: dto.payment.expMonth,
        expYear: dto.payment.expYear,
        cvc: dto.payment.cvc,
        cardHolder: dto.payment.cardHolder,
        // In a real scenario, integritySignature is sent here
      });

      // 5. Handle Payment Response
      if (paymentResponse.status === PaymentStatus.APPROVED) {
        transaction.approve(paymentResponse.providerReference || 'UNKNOWN_REF');
        
        // Discount stock
        product.decreaseStock(1);
        await this.productRepo.update(product);

        // Create delivery
        const delivery = new Delivery(
          uuidv4(),
          transaction.id,
          dto.delivery.address,
          dto.delivery.city,
          dto.delivery.region,
          dto.delivery.zipCode
        );
        await this.deliveryRepo.create(delivery);

      } else if (paymentResponse.status === PaymentStatus.REJECTED) {
        transaction.reject(paymentResponse.providerReference);
      } else {
        transaction.markAsError();
      }

      await this.transactionRepo.update(transaction);
      
      // If payment wasn't approved, return a failed result with the transaction context
      if (transaction.status !== TransactionStatus.APPROVED) {
        return Result.fail(`Payment failed: ${paymentResponse.errorMessage || 'Unknown error'}`);
      }

      return Result.ok(transaction);

    } catch (error: any) {
      return Result.fail(`An error occurred: ${error.message}`);
    }
  }
}
