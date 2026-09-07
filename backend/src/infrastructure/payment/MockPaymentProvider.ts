import { Injectable } from '@nestjs/common';
import { IPaymentProvider, PaymentRequest, PaymentResponse, PaymentStatus } from '../../domain/payment/IPaymentProvider';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MockPaymentProvider implements IPaymentProvider {
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Luhn algorithm check (simplified simulation)
    if (!request.cardNumber || request.cardNumber.length < 13) {
      return {
        status: PaymentStatus.REJECTED,
        errorMessage: 'Invalid card number length'
      };
    }

    // Reject specific test card (e.g., ends in 0000)
    if (request.cardNumber.endsWith('0000')) {
      return {
        status: PaymentStatus.REJECTED,
        providerReference: `REJ_${uuidv4()}`,
        errorMessage: 'Card declined by issuing bank'
      };
    }

    // Simulate error scenario (e.g. ends in 9999)
    if (request.cardNumber.endsWith('9999')) {
       return {
        status: PaymentStatus.ERROR,
        errorMessage: 'Provider connection timeout'
      };
    }

    // Approve the rest
    return {
      status: PaymentStatus.APPROVED,
      providerReference: `TXN_${uuidv4()}`
    };
  }
}
