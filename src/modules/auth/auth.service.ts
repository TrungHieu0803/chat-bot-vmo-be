import { forwardRef, Inject, Injectable, UnauthorizedException, CACHE_MANAGER } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { MemberService } from '../member/member.service';

config();
@Injectable()
export class AuthService {


  constructor(
    @Inject(forwardRef(() => MemberService)) private memberService: MemberService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async login(authLogin: AuthLoginDto): Promise<any> {
    const member = await this.memberService.memberLogin(authLogin);
    console.log(member);
    const accessToken = this.generateToken(member.id, member.email, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION);
    const refreshToken = this.generateToken(member.id, member.email, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRATION);
    await this.cacheManager.set(member.id.toString(), refreshToken, { ttl: 1000 });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    }
  }

  generateToken(id: number, email: string, secretSignature: string, tokenLife: string) {
    const options: JwtSignOptions = { secret: secretSignature };
    options.expiresIn = tokenLife
    return this.jwtService.sign(
      {
        id: id,
        email: email
      },
      options
    );
  }

  verifyToken(tokenFromClient: string) {
    const options: JwtSignOptions = {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
    };
    let decoded = this.jwtService.decode(tokenFromClient) as { id: number, email: string };
    if (!decoded) {
      return {
        isValid: false,
        mess: "Access token is invalid",
        id: -1,
        email: ''
      };
    }
    try {
      this.jwtService.verify<{ id: number, email: string }>(tokenFromClient, options);
      return {
        isValid: true,
        mess: "Access token is valid",
        ...decoded
      };
    } catch (e) {
      return {
        isValid: false,
        mess: "Access token expired",
        ...decoded
      };
    }
  }
}
