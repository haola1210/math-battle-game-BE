import { redisStore } from 'cache-manager-redis-store';
import { Module, CacheModule, CacheStore } from '@nestjs/common';
import { EventsModule } from './features/events/events.module';
import UsersModule from './features/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      useFactory: async (config: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: +config.get('REDIS_PORT'),
          },
          password: config.get('REDIS_PASSWORD'),
        });
        return {
          store: store as unknown as CacheStore,
          ttl: null,
        };
      },
      isGlobal: true,
    }),

    EventsModule,
    UsersModule,
  ],
})
export class AppModule {}
