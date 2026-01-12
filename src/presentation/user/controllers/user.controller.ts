import {
  GetUserProfileUseCase,
  UpdateUserProfilePictureUseCase,
} from '@application/usecases/user';
import { UserTokenPayload } from '@domain/auth';
import { AuthRequest } from '@infrastructure/decorators';
import { AuthGuard } from '@infrastructure/guards';
import {
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUserProfileResponseDto } from '../dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('User')
@Controller({ version: '1' })
export class UserController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfilePictureUseCase: UpdateUserProfilePictureUseCase,
  ) {}

  @ApiOkResponse({
    description: 'Success',
    type: GetUserProfileResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    content: {
      'application/json': {
        examples: {
          UserNotFound: {
            summary: 'User not found',
            value: {
              code: 'USER_NOT_FOUND',
            },
          },
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async getUserProfile(
    @AuthRequest() payload: UserTokenPayload,
  ): Promise<GetUserProfileResponseDto> {
    return await this.getUserProfileUseCase.execute({
      userId: payload.id,
    });
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiNotFoundResponse({
    description: 'Bad Request',
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
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('/picture')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserProfilePicture(
    @AuthRequest() payload: UserTokenPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image/jpeg|image/png|image/webp',
          }),
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5,
            message: '',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    return await this.updateUserProfilePictureUseCase.execute({
      userId: payload.id,
      file,
    });
  }
}
