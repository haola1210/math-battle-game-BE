import { redisStore } from 'cache-manager-redis-store';
import { Module, CacheModule, CacheStore } from '@nestjs/common';
import { EventsModule } from './features/events/events.module';
import UsersModule from './features/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './features/auth/auth.module';

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

    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        uri: `mongodb://${config.get('MONGO_USER')}:${config.get(
          'MONGO_PASSWORD',
        )}@${config.get('MONGO_HOST')}:${config.get('MONGO_PORT')}`,
      }),
      inject: [ConfigService],
    }),

    EventsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
