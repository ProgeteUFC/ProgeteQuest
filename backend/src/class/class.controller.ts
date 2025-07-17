import { Controller } from '@nestjs/common';
import { Get, Post, Body } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dtos/createClass.dto';
import { Class } from './entities/class.entity';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  getAll(): Promise<Class[]> {
    return this.classService.getAllClasses();
  }

  @Post()
  create(@Body() newClass: CreateClassDto): Promise<Class> {
    return this.classService.createClass(newClass);
  }
}
