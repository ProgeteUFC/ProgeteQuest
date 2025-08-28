import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Code } from './entities/code.entity';
import { CreateCodeDto } from './dtos/createCode.dto';
import { generateUuid } from 'src/utils/generateUuid';
import { generateJoinCode } from 'src/utils/generateJoinCode';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(Code)
    private readonly codeRepository: Repository<Code>,
  ) {}

  async createCode(dto: CreateCodeDto) {
    const code = this.codeRepository.create({
      codeId: generateUuid(),
      code: generateJoinCode(10),
      validity: dto.validity,
      active: true,
      score: dto.score,
      activityId: dto.activityId,
    });
    return this.codeRepository.save(code);
  }

  async invalidateCode(id: string) {
    const code = await this.codeRepository.findOne({ where: { codeId: id } });
    if (!code) throw new NotFoundException('Código não encontrado');
    code.active = false;
    return this.codeRepository.save(code);
  }

  async renewCode(id: string) {
    const code = await this.codeRepository.findOne({ where: { codeId: id } });
    if (!code) throw new NotFoundException('Código não encontrado');
    code.code = generateJoinCode(10);
    code.active = true;
    return this.codeRepository.save(code);
  }

  async listCodesByActivity(activityId: string) {
    return this.codeRepository.find({ where: { activityId } });
  }
}
