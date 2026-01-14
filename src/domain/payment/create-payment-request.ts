export class CreatePaymentRequest {
  transactionDetails: {
    order_id: string;
    gross_amount: number;
  };
  customerDetails: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  itemsDetails: object[];
}
