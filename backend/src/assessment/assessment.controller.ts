import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dtos/createAssessment.dto';
import { Assessment } from './entities/assessment.entity';
import { UpdateAssessmentDto } from './dtos/updateAssessment.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Roles('teacher') //
  @Get()
  getAll(): Promise<Assessment[]> {
    return this.assessmentService.getAllAssessments();
  }

  @Roles('teacher')
  @Post()
  create(@Body() newAssessment: CreateAssessmentDto): Promise<Assessment> {
    return this.assessmentService.createAssessment(newAssessment);
  }

  @Roles('teacher')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedAssessment: UpdateAssessmentDto,
  ): Promise<Assessment> {
    return this.assessmentService.updateAssessment(id, updatedAssessment);
  }

  @Roles('teacher')
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.assessmentService.deleteAssessment(id);
  }
}
