import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TerminusModule.forRoot({
      errorLogStyle: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
    }),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
