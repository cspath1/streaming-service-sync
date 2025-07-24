import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BotGuard } from './guards/bot.guard';
import { UserGuard } from './guards/user.guard';
import { AuthTokenSignService } from './services/auth.token.sign.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {},
    }),
  ],
  providers: [BotGuard, UserGuard, AuthTokenSignService],
  exports: [AuthTokenSignService],
})
export class AuthModule {}
