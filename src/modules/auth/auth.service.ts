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
    const user = await this.userService.findByEmail(authLogin.email);
    if (user == null || !await bcrypt.compare(authLogin.password, user.password)) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
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
}
