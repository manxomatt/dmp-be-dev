import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PositionInput } from 'src/inputs/position.input';
import { Position } from 'src/models/position.model';
import { RecruitmentsService } from './recruitments.service';

@Controller('recruitments')
export class RecruitmentsController {
  constructor(private recruitmentService: RecruitmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('positions')
  async recruitments(@Query() query: PositionInput): Promise<Position[]> {
    const responses = await this.recruitmentService.findAll(query);
    return responses.data;
  }

  @UseGuards(JwtAuthGuard)
  @Get('positions/:id')
  async findDetail(@Param('id') id: string) {
    const response = await this.recruitmentService.findOne(id);
    return response.data;
  }
}
