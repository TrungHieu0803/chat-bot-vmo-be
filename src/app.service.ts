import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import {google} from 'googleapis'
import axios from 'axios'
config()
@Injectable()
export class AppService {
  async getHello(): Promise<any> {
    
  }
}
