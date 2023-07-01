import * as redisStore from 'cache-manager-redis-store';
import { Module, CacheModule } from '@nestjs/common';
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
        console.log(redisStore);
        const client = redisStore.create().getClient();

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

    EventsModule,
    UsersModule,
  ],
})
export class AppModule {}
