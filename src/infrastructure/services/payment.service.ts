import { IPaymentService } from '@application/services';
import { CancelPaymentRequest, CreatePaymentRequest } from '@domain/payment';
import { Injectable } from '@nestjs/common';
import { Snap } from 'midtrans-client';
import { v7 as uuid } from 'uuid';

@Injectable()
export class PaymentService implements IPaymentService {
  constructor(private readonly client: Snap) {}

  generateOrderId(): string {
    return `DON-${uuid().split('-').join('')}`;
  }

  async createOrder(req: CreatePaymentRequest) {
    return await this.client.createTransaction({
      transaction_details: req.transactionDetails,
      customer_details: req.customerDetails,
      item_details: req.itemsDetails,
    });
  }

  async cancelOrder(req: CancelPaymentRequest) {
    return await this.client.transaction.cancel(req.orderId);
  }
}
