import { forwardRef, Inject, Injectable, UnauthorizedException, CACHE_MANAGER } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

config();
@Injectable()
export class AuthService {


  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async login(authLogin: AuthLoginDto): Promise<any> {
    console.log(authLogin)
    const user = await this.userService.findByEmail(authLogin.email);
    // if (user == null || !await bcrypt.compare(authLogin.password, user.password)) {
    //   throw new UnauthorizedException('Email or password is incorrect');
    // }
    const accessToken = this.generateToken(user.id, user.email, process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRATION);
    const refreshToken = this.generateToken(user.id, user.email, process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRATION);
    await this.cacheManager.set(user.id.toString(), refreshToken, { ttl: 1000 });
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
        mess: "Invalid access token",
        id: -1,
        email: ''
      };
    }
    try {
      this.jwtService.verify<{ id: number, email: string }>(tokenFromClient, options);
      return {
        isValid: true,
        mess: "Valid access token",
        ...decoded
      };
    } catch (e) {
      return {
        isValid: false,
        mess: "Access token timeout",
        ...decoded
      };
    }
  }
}
