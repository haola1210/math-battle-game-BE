import { forwardRef, Module } from '@nestjs/common';
import RoomsModule from '../rooms/rooms.module';
import UsersModule from '../users/users.module';
import { EventsGateway } from './events.gateway';
import { RoomEventsGateway } from './room-events.gateway';

@Module({
  imports: [forwardRef(() => RoomsModule), forwardRef(() => UsersModule)],
  providers: [EventsGateway, RoomEventsGateway],
})
export class EventsModule {}
