import { Controller, Get, Post, Body } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dtos/createAssessment.dto';
import { Assessment } from './entities/assessment.entity';

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
}
