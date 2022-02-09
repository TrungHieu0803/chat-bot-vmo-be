import { Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SpaceService } from './space.service';

@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ schema: { example: { statusCode: 401, message: 'Access token is invalid', error: 'Unauthorized' } } })
@ApiForbiddenResponse({schema: {example:{statusCode: 403, message: 'Access token expired', error: 'Forbidden'}}})
@ApiNotFoundResponse({ schema: { example: { statusCode: 404, message: 'Token not found', error: 'Not found' } } })
@ApiInternalServerErrorResponse({ schema: { example: { statusCode: 500, message: 'Database connection error', error: 'Internal server error' } } })
@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) { }

  @Get()
  async getListSpace(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10) {
    limit = limit > 20 ? 20 : limit;
    return await this.spaceService.getListSpace(limit, page);
  }

  @Get('/search')
  async searchByName(@Query('name') name: string, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10) {
    return await this.spaceService.searchByDisplayName(limit, page, name);
  }
}
