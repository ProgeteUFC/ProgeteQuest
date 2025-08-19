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

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Get()
  getAll(): Promise<Assessment[]> {
    return this.assessmentService.getAllAssessments();
  }

  @Post()
  create(@Body() newAssessment: CreateAssessmentDto): Promise<Assessment> {
    return this.assessmentService.createAssessment(newAssessment);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedAssessment: UpdateAssessmentDto,
  ): Promise<Assessment> {
    return this.assessmentService.updateAssessment(id, updatedAssessment);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.assessmentService.deleteAssessment(id);
  }
}