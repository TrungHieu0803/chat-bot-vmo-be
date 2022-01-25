import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SpaceService } from './space.service';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) { }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ schema: { example: { statusCode: 401, message: 'Token is invalid', error: 'Unauthorized' } } })
  @ApiNotFoundResponse({ schema: { example: { statusCode: 404, message: 'Token not found', error: 'Not found' } } })
  @ApiInternalServerErrorResponse({ schema: { example: { statusCode: 500, message: 'Database connection error', error: 'Internal server error' } } })
  async getListSpace(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10) {
    limit = limit > 20 ? 20 : limit;
    return await this.spaceService.getListSpace(limit, page);
  }

  @Get('/search')
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ schema: { example: { statusCode: 401, message: 'Token is invalid', error: 'Unauthorized' } } })
  @ApiNotFoundResponse({ schema: { example: { statusCode: 404, message: 'Token not found', error: 'Not found' } } })
  @ApiInternalServerErrorResponse({ schema: { example: { statusCode: 500, message: 'Database connection error', error: 'Internal server error' } } })
  async searchByName(@Query('name') name: string, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10) {
    return await this.spaceService.searchByName(limit, page, name);
  }
}
