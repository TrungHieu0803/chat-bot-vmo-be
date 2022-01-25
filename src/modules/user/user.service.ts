import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    
    constructor(
        @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    ) { }

    async findByEmail(email: string): Promise<UserEntity> {
        try {
            const result = await this.userRepo.findOne({ where: { "email": email } });
            return result != undefined ? result : null;
        } catch (error) {
            throw new InternalServerErrorException(`Database connection error: ${error}`);
        }
    }

    async getUserInfo(id: number): Promise<any> {
      try {
        const result = await this.userRepo.findOne(id);
        return {
            id: result.id,
            email: result.email,
            name: result.name
        }
      } catch (error) {
        throw new InternalServerErrorException(`Database connection error: ${error}`)
      }
    }
}
