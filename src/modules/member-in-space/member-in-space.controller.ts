import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { ListMemberDto } from './dto/list-member.dto';
import { MemberInSpaceService } from './member-in-space.service';

@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ schema: { example: { statusCode: 401, message: 'Access token is invalid', error: 'Unauthorized' } } })
@ApiForbiddenResponse({schema: {example:{statusCode: 403, message: 'Access token expired', error: 'Forbidden'}}})
@ApiNotFoundResponse({ schema: { example: { statusCode: 404, message: 'Token not found', error: 'Not found' } } })
@ApiInternalServerErrorResponse({ schema: { example: { statusCode: 500, message: 'Database connection error', error: 'Internal server error' } } })
@Controller('member-in-space')
export class MemberInSpaceController {
  constructor(private readonly memberInSpaceService: MemberInSpaceService) {}

  @Get('/list-member/:spaceId')
  async listMember(@Param('spaceId') spaceId: number): Promise<ListMemberDto>{
    return this.memberInSpaceService.listMember(spaceId);
  }
}
