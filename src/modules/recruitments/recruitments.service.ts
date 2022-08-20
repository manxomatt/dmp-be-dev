import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { NestConfig } from 'src/configs/config.interface';
import { PositionInput } from 'src/inputs/position.input';
import { Position } from 'src/models/position.model';
import { URLSearchParams } from 'url';

@Injectable()
export class RecruitmentsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  findAll(params?: PositionInput): Promise<AxiosResponse<Position[]>> {
    let qs = '';
    if (params) {
      const qsx = new URLSearchParams();
      if (params.page) qsx.append('page', params.page);
      if (params.description) qsx.append('description', params.description);
      if (params.location) qsx.append('location', params.location);
      if (params.full_time) qsx.append('full_time', params.full_time);

      qs = qsx.toString();
    }

    const nestConfig = this.configService.get<NestConfig>('nest');
    return this.httpService.axiosRef.get(
      nestConfig.sourceUrl + '/positions.json?' + qs,
    );
  }

  findOne(id: string): Promise<AxiosResponse<Position>> {
    const nestConfig = this.configService.get<NestConfig>('nest');
    return this.httpService.axiosRef.get(
      nestConfig.sourceUrl + '/positions/' + id,
    );
  }
}
