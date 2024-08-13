import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('UserServices')
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }


  async create(createAuthDto: CreateAuthDto) {
    try {

      const { password, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })

      await this.userRepository.save(user)
      delete user.password

      return {
        ...user,
        token: this.getJwtToken({ id: user.id })
      }
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true, roles:true, fullName: true }
      });

      if (!user)
          throw new UnauthorizedException('Las credenciales no son válidas')
      
      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Las credenciales no son válidas')
      
      return {
        ...user,
        token: this.getJwtToken({id: user.id})
      }
  }


  async checkAuthStatus(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: { email: true, id: true, roles: true, fullName: true}
    })

    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token;
  }
  
  private handleExceptions( error: any ): never {
    if( error.code === '23505' ) {
      throw new BadRequestException(error.detail)
    } 

    this.logger.error(error)

    throw new InternalServerErrorException('Unexpected error with servers logs')
  }

 

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
