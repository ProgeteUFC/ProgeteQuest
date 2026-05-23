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
import { User, UserPayload } from 'src/decorators/user.decorator';

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Roles('teacher', 'admin')
  @Get()
  getAll(@User() user: UserPayload): Promise<Assessment[]> {
    return this.assessmentService.getAllAssessments(user);
  }

  @Roles('teacher', 'admin')
  @Post()
  create(
    @Body() newAssessment: CreateAssessmentDto,
    @User() user: UserPayload,
  ): Promise<Assessment> {
    return this.assessmentService.createAssessment(newAssessment, user);
  }

  @Roles('teacher', 'admin')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatedAssessment: UpdateAssessmentDto,
    @User() user: UserPayload,
  ): Promise<Assessment> {
    return this.assessmentService.updateAssessment(id, updatedAssessment, user);
  }

  @Roles('teacher', 'admin')
  @Delete(':id')
  delete(@Param('id') id: string, @User() user: UserPayload): Promise<void> {
    return this.assessmentService.deleteAssessment(id, user);
  }
}
