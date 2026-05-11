import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
  Req,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dtos/createClass.dto';
import { Class } from './entities/class.entity';
import { UpdateClassDto } from './dtos/updateClass.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { SearchClassDto } from './dtos/searchClass.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Roles('teacher', 'student')
  @Get()
  getAll(@Req() req: any): Promise<Class[]> {
    return this.classService.getAllClasses(req.user);
  }

  @Roles('teacher')
  @Post()
  create(@Body() newClass: CreateClassDto): Promise<Class> {
    return this.classService.createClass(newClass);
  }

  @Roles('teacher')
  @Patch(':id/join-code')
  async regenerateJoinCode(
    @Param('id') id: string,
    @Req() req: any,
  ): Promise<Class> {
    return this.classService.regenerateJoinCode(id, req.user);
  }

  @Roles('teacher')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedClass: UpdateClassDto,
    @Req() req: any,
  ): Promise<Class> {
    return this.classService.updateClass(id, updatedClass, req.user);
  }

  @Roles('teacher')
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any): Promise<void> {
    return this.classService.deleteClass(id, req.user);
  }

  @Roles('teacher', 'student')
  @Get(':id')
  async getById(@Param('id') id: string, @Req() req: any) {
    return this.classService.getClassById(id, req.user);
  }

  @Roles('teacher', 'student')
  @Post('search')
  async searchClasses(
    @Body() searchDto: SearchClassDto,
    @Req() req: any,
  ) {
    return this.classService.searchClasses(searchDto, req.user);
  }
}