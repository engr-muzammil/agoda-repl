import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }
    // This method is a placeholder for creating a user.
    async create(createUserDto: CreateUserDto) {
        return this.usersRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10), 
        });
    }

    async validateUser(email: string, password: string) {
        // This method should validate the user credentials.
        // For now, it returns a placeholder v alue.
        const user = await this.usersRepository.findOne({email});
        const isPasswordValid = user && await bcrypt.compare(password, user.password);
        if (!user || !isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }
        return user;
    }
}
