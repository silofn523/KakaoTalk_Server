/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common'
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

  public async createUser(createUserDto: CreateUserDto): Promise<number> {
    const salt = await bcrypt.genSalt()
    const password = await this.hashPassword(createUserDto.password, salt)

    const user = await this.user.save({
      username: createUserDto.username,
      tel: createUserDto.tel,
      password,
      email: createUserDto.email,
      fullName: createUserDto.fullName,
      statusMessage: createUserDto.statusMessage,
      birthday: createUserDto.birthday
    })

    return user.id
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

  public async fullNameAndTelCheck(fullName: string, tel: string): Promise<User | null> {
    const existing = await this.user.findOne({
      where: { fullName, tel } // 이름과 전화번호 모두 일치한지 체크
    })

    if (!existing) {
      throw new ConflictException({
        success: false,
        message: `친구 추가하려는 사용자 정보를 다시 확인해주세요.`
      })
    }
    return existing
  }

  public async findAllUser(): Promise<User[]> {
    return await this.user.find()
  }

  public async getOneUser(id: number): Promise<User> {
    return await this.user.findOne({
      where: {
        id
      }
    })
  }

  public async updateUserStatus(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const { ...update } = updateUserDto

    if (update.password) {
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
    return (
      (await this.user.findOne({
        where: [{ email: login }, { tel: login }, { username: login }],
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
      })) ?? undefined
    )
  }
}
