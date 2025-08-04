import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Campus } from './entities/campus.entity';

import { Department } from './entities/department.entity';
import { JwtService } from '@nestjs/jwt';
import { Faculty } from './entities/faculity.entity';

@Module({
  imports:[ SequelizeModule.forFeature([
    Campus,Faculty,Department
  ])],
  controllers: [SettingsController],
  providers: [SettingsService,JwtService],
})
export class SettingsModule {}
