import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dtos/createClass.dto';
import { Class } from './entities/class.entity';
import { UpdateClassDto } from './dtos/updateClass.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { SearchClassDto } from './dtos/searchClass.dto';
import { User, UserPayload } from 'src/decorators/user.decorator';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Roles('teacher', 'admin', 'student')
  @Get()
  getAll(@User() user: UserPayload): Promise<Class[]> {
    return this.classService.getAllClasses(user);
  }

  @Roles('teacher', 'admin')
  @Post()
  create(
    @Body() newClass: CreateClassDto,
    @User() user: UserPayload,
  ): Promise<Class> {
    return this.classService.createClass(newClass, user);
  }

  @Roles('teacher', 'admin')
  @Patch(':id/join-code')
  async regenerateJoinCode(
    @Param('id') id: string,
    @User() user: UserPayload,
  ): Promise<Class> {
    return this.classService.regenerateJoinCode(id, user);
  }

  @Roles('teacher', 'admin')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedClass: UpdateClassDto,
    @User() user: UserPayload,
  ): Promise<Class> {
    return this.classService.updateClass(id, updatedClass, user);
  }

  @Roles('teacher', 'admin')
  @Delete(':id')
  delete(@Param('id') id: string, @User() user: UserPayload): Promise<void> {
    return this.classService.deleteClass(id, user);
  }

  @Roles('teacher', 'admin', 'student')
  @Get(':id')
  async getById(@Param('id') id: string, @User() user: UserPayload) {
    return this.classService.getClassById(id, user);
  }

  @Roles('teacher', 'admin', 'student')
  @Post('search')
  async searchClasses(
    @Body() searchDto: SearchClassDto,
    @User() user: UserPayload,
  ) {
    return this.classService.searchClasses(searchDto, user);
  }
}