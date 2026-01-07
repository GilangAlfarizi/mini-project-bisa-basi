import { SendEmailRequest } from '@domain/mail';

export abstract class IMailService {
  abstract sendEmail(req: SendEmailRequest): Promise<void>;
}
