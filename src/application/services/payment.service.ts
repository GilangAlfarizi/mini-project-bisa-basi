import { CancelPaymentRequest, CreatePaymentRequest } from '@domain/payment';

export abstract class IPaymentService {
  abstract generateOrderId(): string;
  abstract createOrder(req: CreatePaymentRequest);
  abstract cancelOrder(req: CancelPaymentRequest);
}
