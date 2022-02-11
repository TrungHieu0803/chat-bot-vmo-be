import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { ListMemberDto } from './dto/list-member.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { MemberInSpaceService } from './member-in-space.service';

@ApiTags('member-in-space')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ schema: { example: { statusCode: 401, message: 'Access token is invalid', error: 'Unauthorized' } } })
@ApiForbiddenResponse({ schema: { example: { statusCode: 403, message: 'Access token expired', error: 'Forbidden' } } })
@ApiNotFoundResponse({ schema: { example: { statusCode: 404, message: 'Token not found', error: 'Not found' } } })
@ApiInternalServerErrorResponse({ schema: { example: { statusCode: 500, message: 'Database connection error', error: 'Internal server error' } } })
@Controller('member-in-space')
export class MemberInSpaceController {
  constructor(private readonly memberInSpaceService: MemberInSpaceService) { }

  @Get('/list-member/:spaceId')
  async listMember(@Param('spaceId') spaceId: number): Promise<ListMemberDto> {
    return this.memberInSpaceService.listMember(spaceId);
  }

  @Get(':spaceId/member-info')
  async getMemberInfo(@Param('spaceId') spaceId: number, @Query('role') role: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(7), ParseIntPipe) limit: number = 7): Promise<any> {
    return await this.memberInSpaceService.findBySpaceAndRole(limit, page, spaceId, role);
  }

  @Get(':spaceId/member-info/search')
  async searchByMemberName(@Param('spaceId') spaceId: number, @Query('role') role: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(7), ParseIntPipe) limit: number = 7, @Query('mn') mn: string): Promise<any> {
    return await this.memberInSpaceService.searchByMemberName(limit, page, spaceId, role, mn);
  }

  @Put('/update-role')
  async updateRole(@Body()data: UpdateRoleDto): Promise<any>{
    return await this.memberInSpaceService.updateRole(data.spaceId, data.memberId, data.role);
  }
}
