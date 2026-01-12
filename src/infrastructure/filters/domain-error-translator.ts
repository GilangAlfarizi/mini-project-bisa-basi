import { formatErrorCode } from '@infrastructure/utils';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';

interface IDomainErrorTranslator {
  _directories: Record<string, HttpException>;
  translate: (error: Error) => HttpException;
}

const directories = {
  'GET_CAMPAIGN_DETAIL_USECASE.CAMPAIGN_NOT_FOUND': new NotFoundException(
    'CAMPAIGN_NOT_FOUND',
  ),
  'GET_USER_DONATIONS_USECASE.USER_NOT_FOUND': new NotFoundException(
    'USER_NOT_FOUND',
  ),
  'UPDATE_USER_PROFILE_USECASE.USER_NOT_FOUND': new BadRequestException(
    'USER_NOT_FOUND',
  ),
};

export const DomainErrorTranslator: IDomainErrorTranslator = {
  _directories: directories,
  translate(error: Error): HttpException {
    const errorMessage = formatErrorCode(error.message);

    if (
      error instanceof ForbiddenException ||
      error instanceof UnauthorizedException
    ) {
      return error;
    }

    if (error instanceof JsonWebTokenError) {
      return new UnauthorizedException(errorMessage);
    }

    if (error instanceof NotFoundException) {
      return new NotFoundException(errorMessage);
    }

    if (
      error instanceof BadRequestException &&
      !this._directories[error.message]
    ) {
      return new BadRequestException(errorMessage);
    }

    return (
      this._directories[errorMessage] ||
      new InternalServerErrorException('INTERNAL_SERVER_ERROR')
    );
  },
};
