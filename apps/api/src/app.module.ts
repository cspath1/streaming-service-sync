import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { HealthModule } from './routes/health/health.module';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AuthMiddleware } from './modules/auth/middleware/auth.middleware';

@Module({
  imports: [SentryModule.forRoot(), HealthModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
