import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ schema: { example: {id: 'number', email: 'string', name: 'string'} } })
  @ApiUnauthorizedResponse({ schema: { example: { statusCode: 401, message: 'Access token is invalid', error: 'Unauthorized' } } })
  @ApiForbiddenResponse({schema: {example:{statusCode: 403, message: 'Access token expired', error: 'Forbidden'}}})
  @ApiNotFoundResponse({ schema: { example: { statusCode: 404, message: 'Token not found', error: 'Not found' } } })
  @ApiInternalServerErrorResponse({ schema: { example: { statusCode: 500, message: 'Database connection error', error: 'Internal server error' } } })
  async getInfo(@Request() req) {
    return await this.userService.getUserInfo(req.headers.id);
  }

}
