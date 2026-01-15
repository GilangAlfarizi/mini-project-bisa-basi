import { WebhookMidtransUseCase } from '@application/usecases/webhook';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Webhook')
@Controller({ version: '1' })
export class WebhookController {
  constructor(
    private readonly webhookMidtransUseCase: WebhookMidtransUseCase,
  ) {}

  @ApiOkResponse({
    description: 'Success',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/midtrans')
  async handleMidtransNotification(@Body() body: any): Promise<void> {
    return await this.webhookMidtransUseCase.execute(body);
  }
}
