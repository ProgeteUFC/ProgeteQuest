import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forum, Topic, Post } from './entities/index';
import { Class } from 'src/class/entities/class.entity';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Forum, Topic, Post, Class])],
  controllers: [ForumController],
  providers: [ForumService],
  exports: [ForumService],
})
export class ForumModule {}