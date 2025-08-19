import { Module } from '@nestjs/common';
import { CheckinService } from './checkin.service';

@Module({
  providers: [CheckinService]
})
export class CheckinModule {}
