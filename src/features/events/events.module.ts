import { forwardRef, Module } from '@nestjs/common';
import RoomsModule from '../rooms/rooms.module';
import UsersModule from '../users/users.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [forwardRef(() => RoomsModule), forwardRef(() => UsersModule)],
  providers: [EventsGateway],
})
export class EventsModule {}
