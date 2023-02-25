import { Module } from '@nestjs/common';
import { EventsModule } from './features/events/events.module';

@Module({
  imports: [EventsModule],
})
export class AppModule {}
