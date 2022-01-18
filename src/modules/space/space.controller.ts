import { Controller } from '@nestjs/common';
import { SpaceService } from './space.service';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}
}
