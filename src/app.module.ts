import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './role/roles.guard';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [AuthModule, PrismaModule, RedisModule, UsersModule, CoursesModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }, {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }],
})
export class AppModule { }
