import { config } from 'dotenv';
import { google } from 'googleapis'
import axios from 'axios'
import { InternalServerErrorException } from '@nestjs/common';

config()
export class GoogleChatApis {
    async getJWT() {
        const jwtClient = new google.auth.JWT(
            process.env.GOOGLE_CLIENT_EMAIL,
            null,
            process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), ['https://www.googleapis.com/auth/chat.bot']
        );
        jwtClient.authorize(async (err, tokens) => {
            if (err) {
                throw new InternalServerErrorException(`Can get JWT: ${err}`);
            } else {
                return tokens.access_token;
            }
        });
    }

    async getSpaces() {
        try {
            const accessToken = await this.getJWT();
            const res = await axios.get(`https://chat.googleapis.com/v1/spaces`,
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
            return res.data;
        } catch (error) {
            throw new InternalServerErrorException(`Can not fetch api from google: ${error}`);
        }
    }

    async getMembersInSpace(spaceName: string) {
        try {
            const accessToken = await this.getJWT();
            const res = await axios.get(`https://chat.googleapis.com/v1/${spaceName}/members`,
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                });
            return res.data;
        } catch (error) {
            throw new InternalServerErrorException(`Can not fetch api from google: ${error}`);
        }
    }

    async createMessage(message: string, spaceName: string) {
        try {
            const accessToken = await this.getJWT();
            const res = await axios.post(`https://chat.googleapis.com/v1/${spaceName}/messages`, { 'text': message }, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
            return res.data;
        } catch (error) {
            throw new InternalServerErrorException(`Can not fetch api from google: ${error}`);
        }
    }


}