import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CreateCampusDto } from './dto/create-campus.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UpdateCampusDto } from './dto/update-campus.dto';

import { UpdateDepartmentDto } from './dto/update-department.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadConfig } from 'src/utils/file-upload-config';
import { CreateFacultyDto } from './dto/create-faculity.dto';
import { UpdateFacultyDto } from './dto/update-faculity.dto';

// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Post('/campus')
  @ApiOperation({ summary: 'Create Campus ' })
  create(@Body() createCampusDto: CreateCampusDto) {
    return this.settingsService.create(createCampusDto);
  }

  @Get()
  @ApiOperation({ summary: 'get all Campus ' })

  findAll() {
    return this.settingsService.findAllCampus();
  }

  @Get(':id')
  @ApiOperation({ summary: 'get campus by id ' })

  findOne(@Param('id') id: number) {
    return this.settingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update campus by id ' })

  update(@Param('id') id: number, @Body() updateCampusDto: UpdateCampusDto) {
    return this.settingsService.update(id, updateCampusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete campus by id ' })

  remove(@Param('id') id: number) {
    return this.settingsService.remove(id);
  }
  //department controller


  @Post('/faculty')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'stamp',
      FileUploadConfig.getOptions('./uploads/stamps'),
    ),
  )
  @ApiOperation({ summary: 'Create faculty ' })
  createfaculty(@Body() createfacultyDto: CreateFacultyDto,
    @UploadedFile() stamp: Express.Multer.File) {
    if (stamp) {
      createfacultyDto.stamp = `${process.env.base_url}/uploads/stamps/${stamp.filename}`; // Save the filename in the DTO
    }
    return this.settingsService.createfaculty(createfacultyDto);
  }

  @Get('/all/faculties')
  @ApiOperation({ summary: 'get all faculty with optional campus filter' })
  @ApiQuery({
    name: 'campusId',
    required: false,
    type: 'string',
    description: 'Filter facultys by campus ID'
  })
  findAllfaculty(@Query('campusId') campusId?: string) {
    return this.settingsService. findAllFaculties(campusId);
  }

  @Get('faculty/:id')
  @ApiOperation({ summary: 'get faculty by id ' })

  findOnefaculty(@Param('id') id: number) {
    // return this.settingsService.findOnefaculty(id);
  }

  @Patch('faculty/:id')
  @ApiOperation({ summary: 'update faculty by id ' })
  updatefaculty(@Param('id') id: number, @Body() updatefacultyDto: UpdateFacultyDto) {
    // return this.settingsService.updatefaculty(id, updatefacultyDto);
  }

  @Delete('faculty/:id')
  @ApiOperation({ summary: 'delete faculty by id ' })
  removefaculty(@Param('id') id: number) {
    // return this.settingsService.removefaculty(id);
  }

  //faculty controller
  @Post('/Department')
  @ApiOperation({ summary: 'Create Department ' })
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.settingsService.createDepartment(createDepartmentDto);
  }

  @Get('Departments/all')
  @ApiOperation({ summary: 'get all Department with optional campus filter' })
  @ApiQuery({
    name: 'facultyId',
    required: false,
    type: 'string',
    description: 'Filter departments by faculty ID'
  })
  findAllDepartment(@Query('facultyId') facultyId?: string) {
    return this.settingsService.findAllDepartment(facultyId);
  }

  @Get('Department/:id')
  @ApiOperation({ summary: 'get Department by id ' })

  findOneDepartment(@Param('id') id: number) {
    return this.settingsService.findOneDepartment(id);
  }

  @Patch('Department/:id')
  @ApiOperation({ summary: 'update Department by id ' })
  updateDepartment(@Param('id') id: number, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.settingsService.updateDepartment(id, updateDepartmentDto);
  }

  @Delete('Department/:id')
  @ApiOperation({ summary: 'delete Department by id ' })
  removeDepartment(@Param('id') id: number) {
    return this.settingsService.removeDepartment(id);
  }
}
