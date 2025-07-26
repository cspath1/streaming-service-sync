import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        // Include "debug" logs in development
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? // format logs in development
              {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  ignore: 'pid,hostname,context',
                  levelFirst: true,
                  translateTime: 'SYS:hh:MM:ss',
                  messageFormat: '{msg}',
                },
              }
            : undefined,
      },
    }),
  ],
})
export class LogModule {}
