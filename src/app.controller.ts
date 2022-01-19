import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('bot')
  handleEvents(@Request() req){
    return this.appService.handleEvents(req.body);
  }
}
