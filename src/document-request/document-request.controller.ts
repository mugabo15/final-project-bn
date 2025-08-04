import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFiles, BadRequestException, UseGuards } from '@nestjs/common';
import { DocumentRequestService } from './document-request.service';
import { ApproveDocumentRequestDto, CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { UpdateDocumentRequestDto } from './dto/update-document-request.dto';


import { CreateRecomandationRequestDto, CreateToWhomRequestDto, QuerryFindAllRecomandationRequestDto, UpdateRecomandationRequestDto, UpdateRecomandationRequestStaffDto, UpdateToWhomRequestStaffDto } from './dto/create-recomandation.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Op } from 'sequelize';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { FileUploadConfig } from 'src/utils/file-upload-config';
import { CreateTranscriptChangesDto, CreateTranscriptRequestDto, HodUpdateTranscriptRequestDto, QuerryFindAllTranscriptRequestDto, UpdateTranscriptRequestDto } from './dto/create-transcript-request.dto';
import { CreateEnglishCertificateChangesDto, CreateEnglishCertificateDto, QuerryFindAllEnglishCertificateRequestDto, UpdateEnglishCertificateRequestDto, UpdateEnglishCertificateRequestStaffDto } from './dto/create-english-certificate.dto';
import { CreateDeclarationChangeDto, CreateDeclarationProofOfPaymentDto, CreateDeclarationRequestDto, QuerryFindAllDeclarationRequestDto, UpdateDeclarationRequestFinanceDto, UpdateDeclarationRequestLibraryDto, UpdateDeclarationRequestWelfareDto } from './dto/create-decration-request.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateTranscriptDto, QueryFindAllTranscriptRequestDto } from './dto/create-transcript.dto';
import * as XLSX from 'xlsx';
import { readFileSync } from 'fs';
import { Transcript } from './entities/transcripts-marks.entity';
import { Sequelize } from 'sequelize-typescript';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';


interface StudentRecord {
  refNo: string;
  sex: string;
  semesters: {
    semester1: Record<string, { mark: number; grade: string; credit: number }>;
    semester2: Record<string, { mark: number; grade: string; credit: number }>;
  };
  totalCredits: number | null;
  annualAverage: number | null;
  previousFailedModules: string[];
  currentFailedModules: string[];
  remark: string | null;
}

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('recomandation-request')
export class DocumentRequestController {
  constructor(private readonly documentRequestService: DocumentRequestService) { }

  @Post('/:userId')
  // @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new document request' })
  createRequest(
    @Body() createDocumentRequestDto: CreateDocumentRequestDto,
    @Param('userId') userId: number
  ) {
    return this.documentRequestService.createDocumentRequest(createDocumentRequestDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all document requests by filters' })
  @ApiQuery({ name: 'userId', required: false, type: Number, description: 'Filter by user ID' })
  @ApiQuery({ name: 'documentType', required: false, type: String, description: 'Filter by document type' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by request status' })
  @ApiQuery({ name: 'fromDate', required: false, type: String, description: 'Filter by start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'toDate', required: false, type: String, description: 'Filter by end date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'departmentId', required: false, type: Number, description: 'Filter by department ID' })
  @ApiQuery({ name: 'facultyId', required: false, type: Number, description: 'Filter by faculty ID' })
  @ApiQuery({ name: 'campusId', required: false, type: Number, description: 'Filter by campus ID' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by request status' })
  @ApiQuery({ name: 'assignedToId', required: false, type: Number, description: 'Filter by assigned staff ID' })
  @ApiQuery({ name: 'regnumber', required: false, type: String, description: 'Filter by registration number' })
  @ApiQuery({ name: 'schoolId', required: false, type: Number, description: 'Filter by school ID' })
  @ApiQuery({ name: 'program', required: false, type: String, description: 'Filter by program' })
  @ApiQuery({ name: 'level', required: false, type: String, description: 'Filter by level' })
  @ApiQuery({ name: 'courseName', required: false, type: String, description: 'Filter by course name' })
  @ApiQuery({ name: 'date', required: false, type: String, description: 'Filter by request date (YYYY-MM-DD)' })

  async findAllRequests(@Query() query: any) {
    const whereClause: any = {};
    if (query.userId) {
      whereClause.userId = query.userId;
    }
    if (query.documentType) {
      whereClause.documentType = query.documentType;
    }
    if (query.status) {
      whereClause.status = query.status;
    }
    if (query.fromDate && query.toDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(query.fromDate), new Date(query.toDate)],
      };
    }

    return this.documentRequestService.findAllDocumentRequests(whereClause);
  }

  @Patch(':id/approve')
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'role', required: true, type: String, description: 'Role of the approver (e.g., "hod", "dean")' })
 
  async approveDocumentRequest(
    @Param('id') id: string,
    // @Body() approveDocumentRequestDto: ApproveDocumentRequestDto
    @Query() querry:any
  ) {
    try {
      

      return await this.documentRequestService.approveDocumentRequest(+id,  querry.role);
    } catch (error) {
      console.log(`Failed to approve document request: ${error.message}`);
      
      throw new BadRequestException(`Failed to approve document request: ${error.message}`);
    }
  }

  @Patch(':id/reject')
  @ApiQuery({ name: 'role', required: true, type: String, description: 'Role of the rejector (e.g., "dean", "library")' })
  @ApiQuery({ name: 'reason', required: false, type: String, description: 'Reason for rejection' })
  @ApiOperation({ summary: 'Reject a document request' })
  async rejectDocumentRequest(
    @Param('id') id: string,
    @Query('role') role: string,
    @Query('reason') reason?: string
  ) {
    try {
      return await this.documentRequestService.rejectDocumentRequest(+id, role, reason);
    } catch (error) {
      throw new BadRequestException(`Failed to reject document request: ${error.message}`);
    }
  }

  @Patch('/request/staff/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'fileUrl',
      FileUploadConfig.getOptions('./uploads/recomandations'),
    ),
  )
  @ApiBody({ type: UpdateRecomandationRequestStaffDto, description: 'Form data for updating a recommendation request' })
  @ApiParam({ name: 'id', description: ' request ID' })
  @ApiOperation({ summary: 'Update Recomandation letter by ID ⚠️ done by staff' })
  async updateByStaff(
    @Param('id') id: string,
    @UploadedFile() fileUrl: Express.Multer.File,
    @Body() updateRecomandationRequestStaffDto: UpdateRecomandationRequestStaffDto,
  ) {
    if (fileUrl) {
      // Adjust file path to include server base path
      updateRecomandationRequestStaffDto.fileUrl = `${process.env.base_url}/uploads/recomandations/${fileUrl.filename}`;
    }
    return this.documentRequestService.updateRecomandationByStaff(+id, updateRecomandationRequestStaffDto);
  }

 }