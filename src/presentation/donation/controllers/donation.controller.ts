import {
  CreateDonationCheckoutUseCase,
  CreateDonationUseCase,
  GetUserDonationsUseCase,
} from '@application/usecases/donation';
import { UserTokenPayload } from '@domain/auth';
import { AuthRequest } from '@infrastructure/decorators';
import { AuthGuard } from '@infrastructure/guards';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  CreateDonationCheckoutRequestDto,
  CreateDonationCheckoutResponseDto,
  CreateDonationRequestDto,
  CreateDonationResponseDto,
  GetUserDonationsResponseDto,
} from '../dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Donation')
@Controller({ version: '1' })
export class DonationController {
  constructor(
    private readonly createDonationUseCase: CreateDonationUseCase,
    private readonly getUserDonationsUseCase: GetUserDonationsUseCase,
    private readonly createDonationCheckoutUseCase: CreateDonationCheckoutUseCase,
  ) {}

  @ApiOkResponse({
    description: 'Success',
    type: CreateDonationResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  async createDonation(
    @Body() body: CreateDonationRequestDto,
  ): Promise<CreateDonationResponseDto> {
    return await this.createDonationUseCase.execute(body);
  }

  @ApiOkResponse({
    description: 'Success',
    type: [GetUserDonationsResponseDto],
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    content: {
      'application/json': {
        examples: {
          EnrollmentNotFound: {
            summary: 'User not found',
            value: {
              code: 'USER_NOT_FOUND',
            },
          },
        },
      },
    },
  })
  @Get('/:userId')
  async getUserDonations(
    @Param() param: { userId: string },
  ): Promise<GetUserDonationsResponseDto[]> {
    return await this.getUserDonationsUseCase.execute(param);
  }

  @ApiOkResponse({
    description: 'Success',
    type: CreateDonationCheckoutResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/checkout')
  async createDonationCheckout(
    @AuthRequest() payload: UserTokenPayload,
    @Body() body: CreateDonationCheckoutRequestDto,
  ): Promise<CreateDonationCheckoutResponseDto> {
    return await this.createDonationCheckoutUseCase.execute({
      ...body,
      userId: payload.id,
    });
  }
}
