import {
  CreateUserDonationUseCase,
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
  CreateUserDonationRequestDto,
  CreateUserDonationResponseDto,
  GetUserDonationsResponseDto,
} from '../dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('Donation')
@Controller({ version: '1' })
export class DonationController {
  constructor(
    private readonly getUserDonationsUseCase: GetUserDonationsUseCase,
    private readonly createUserDonationUseCase: CreateUserDonationUseCase,
  ) {}

  @ApiOkResponse({
    description: 'Success',
    type: CreateUserDonationResponseDto,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  async createUserDonation(
    @AuthRequest() payload: UserTokenPayload,
    @Body() body: CreateUserDonationRequestDto,
  ): Promise<CreateUserDonationResponseDto> {
    return await this.createUserDonationUseCase.execute({
      ...body,
      userId: payload.id,
    });
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
  @Get('/history')
  async getUserDonations(
    @AuthRequest() payload: UserTokenPayload,
  ): Promise<GetUserDonationsResponseDto[]> {
    return await this.getUserDonationsUseCase.execute({ userId: payload.id });
  }
}
