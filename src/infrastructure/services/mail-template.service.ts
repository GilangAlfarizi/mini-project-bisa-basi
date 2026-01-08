import { IMailTemplateService } from '@application/services';
import { VerifyEmailRequest } from '@domain/mail-template';
import { Injectable } from '@nestjs/common';
import * as ejs from 'ejs';
import * as path from 'path';

@Injectable()
export class MailTemplateService implements IMailTemplateService {
  constructor() {}

  async verifyEmail(req: VerifyEmailRequest): Promise<any> {
    return ejs.renderFile(
      path.join(__dirname, '..', 'templates', 'verify-email.ejs'),
      {
        name: req.name,
        confirmUrl: req.confirmUrl,
      },
    );
  }
}
