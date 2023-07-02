import * as redisStore from 'cache-manager-redis-store';
import { Module, CacheModule } from '@nestjs/common';
import { EventsModule } from './features/events/events.module';
import UsersModule from './features/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { ProxyGuard } from './features/auth/guards/proxy.guard';
import { AuthModule } from './features/auth/auth.module';

@Module({
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: ProxyGuard,
  //   },
  // ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      useFactory: async (config: ConfigService) => {
        const client = redisStore
          .create({
            host: config.get('REDIS_HOST'),
            port: Number(config.get('REDIS_PORT')),
            password: config.get('REDIS_PWD'),
          })
          .getClient();

        client.on('error', (err) => console.log('Redis Client Error', err));
        client.on('ready', () => {
          const response = client.ping();
          console.log(`PING to redis server: ${response}`);
        });

        return {
          store: {
            create: () => client,
          },
          host: config.get('REDIS_HOST'),
          port: Number(config.get('REDIS_PORT')),
          password: config.get('REDIS_PWD'),
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
