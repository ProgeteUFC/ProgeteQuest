import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forum, Topic, Post } from './entities/index';

@Module({
  imports: [TypeOrmModule.forFeature([Forum, Topic, Post])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class ForumModule {}
