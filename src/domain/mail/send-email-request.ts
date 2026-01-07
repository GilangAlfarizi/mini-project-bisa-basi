export class SendEmailToRequest {
  name: string;
  address: string;
}

export class SendEmailSenderRequest {
  name: string;
  address: string;
}

export class SendEmailRequest {
  from: SendEmailSenderRequest;
  to: SendEmailToRequest[];
  subject: string;
  text?: string;
  html?: string;
}
