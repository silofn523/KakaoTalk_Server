import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<void> {
    const salt = await bcrypt.genSalt()
    const password = await this.hashPassword(createUserDto.password, salt)

    await this.user.insert({
      username: createUserDto.username,
      tel: createUserDto.tel,
      password,
      email: createUserDto.email,
      fullName: createUserDto.fullName,
      statusMessage: createUserDto.statusMessage,
      birthday: createUserDto.birthday
    })
  }

  public async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt)
  }

  public async checkUserTelAndUsernameAndEmail(tel: string, username: string, email: string): Promise<void> {
    const existing = await this.user.findOne({
      where: [{ tel }, { username }, { email }]
    })

    if (existing) {
      if (existing.tel === tel) {
        throw new ConflictException({
          success: false,
          message: `${tel}은 이미 사용중인 전화번호 입니다`
        })
      }

      if (existing.username === username) {
        throw new ConflictException({
          success: false,
          message: `${username}은 이미 사용중인 이름 입니다`
        })
      }

      if (existing.email === email) {
        throw new ConflictException({
          success: false,
          message: `${email}은 이미 사용중인 이메일 입니다`
        })
      }
    }
  }

  public async findAllUser(): Promise<User[]> {
    return await this.user.find()
  }

  public async getOneUser(id: number): Promise<void | User> {
    return await this.user.findOne({
      where: { 
        id 
      }
    })
  }

  public async updateUserStatus(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const { ...update } = updateUserDto
    
    if(update.password) {
      const salt = await bcrypt.genSalt()

      update.password = await this.hashPassword(update.password, salt)
    }
    await this.checkUserTelAndUsernameAndEmail(updateUserDto.tel, updateUserDto.username, updateUserDto.email)
    await this.user.update({ id }, update)
  }

  public async deleteUser(id: number): Promise<void> {
    await this.user.delete({ id })
  }

  public async findUserByLogin(login: string, secret = false): Promise<User | undefined> {
    return await this.user.findOne({
      where: [
        { email: login },
        { tel: login },
        { username: login }
      ],
      select: {
        id: true,
        email: true,
        username: true,
        tel: true,
        fullName: true,
        statusMessage: true,
        birthday: true,
        password: secret
      }
    }) ?? undefined
  }
}
