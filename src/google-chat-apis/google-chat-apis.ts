import { config } from 'dotenv';
import { google } from 'googleapis'
import axios from 'axios'
import { InternalServerErrorException } from '@nestjs/common';

config();

const getJWT = async () => {

    const jwtClient = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), ['https://www.googleapis.com/auth/chat.bot']
    );
    try {
        const token = await jwtClient.authorize();
        return token.access_token;
    } catch (error) {
        throw new InternalServerErrorException(error);
    }
}

export const getSpaces = async () => {
    try {
        const accessToken = await getJWT();
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

export const getMembersInSpace = async (spaceName: string) => {
    try {
        const accessToken = await getJWT();
        const res = await axios.get(`https://chat.googleapis.com/v1/${spaceName}/members`,
            {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
        return res.data.memberships;
    } catch (error) {
        throw new InternalServerErrorException(`Can not fetch api from google: ${error}`);
    }
}

export const createMessage = async (message: string, spaceName: string) => {
    try {
        const accessToken = await getJWT();
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


