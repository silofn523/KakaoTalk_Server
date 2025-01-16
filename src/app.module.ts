/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigurationModule } from './configuration/configuration.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ChatsModule } from './chats/chats.module';
import { FriendModule } from './friend/friend.module';
import { AuthMiddleware } from './auth/auth.middleware'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_SCHEMA'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: config.get<boolean>('TYPEORM_SYBCHRONIZE')
      })
    }),
    ConfigurationModule,
    UsersModule,
    AuthModule,
    ChatsModule,
    FriendModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*')
  }
}
