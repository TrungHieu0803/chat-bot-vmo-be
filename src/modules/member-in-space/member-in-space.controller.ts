import { Controller } from '@nestjs/common';
import { MemberInSpaceService } from './member-in-space.service';

@Controller('member-in-space')
export class MemberInSpaceController {
  constructor(private readonly memberInSpaceService: MemberInSpaceService) {}
}
