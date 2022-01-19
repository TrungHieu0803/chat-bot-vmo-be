import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { google } from 'googleapis'
import axios from 'axios'
config()
@Injectable()
export class AppService {
  handleEvents(body: any) {
    if (body['type'] === 'ADDED_TO_SPACE') {
      return { text: `Thank for adding me to space ${body['space']['displayName']}` };
    } else if (body['type'] === 'MESSAGE') {
      return { text: `You said: ${body['message']['text']}`};
    }
  }
}
