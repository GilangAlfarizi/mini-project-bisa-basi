import { VerifyEmailRequest } from '@domain/mail-template';

export abstract class IMailTemplateService {
  abstract verifyEmail(req: VerifyEmailRequest): Promise<string>;
}
