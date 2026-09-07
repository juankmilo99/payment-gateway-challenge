import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { GetProductsUseCase } from '../../application/product/GetProductsUseCase';
import { ProcessPaymentUseCase } from '../../application/transaction/ProcessPaymentUseCase';
import { PaymentRequestDto } from './dto/PaymentRequestDto';

@Controller('products')
export class ProductController {
  constructor(private readonly getProductsUseCase: GetProductsUseCase) {}

  @Get()
  async getProducts() {
    const result = await this.getProductsUseCase.execute();
    if (result.isFailure) {
      throw new HttpException(result.error || 'Unknown error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result.getValue();
  }
}

@Controller('transactions')
export class TransactionController {
  constructor(private readonly processPaymentUseCase: ProcessPaymentUseCase) {}

  @Post()
  async createTransaction(@Body() dto: PaymentRequestDto) {
    const result = await this.processPaymentUseCase.execute(dto);
    
    if (result.isFailure) {
      // For simplicity, returning 400 Bad Request for business errors
      throw new HttpException({
        message: result.error,
        status: 'FAILED'
      }, HttpStatus.BAD_REQUEST);
    }
    
    const transaction = result.getValue();
    return {
      id: transaction.id,
      status: transaction.status,
      totalAmount: transaction.totalAmount,
      providerReference: transaction.providerReference,
    };
  }
}
