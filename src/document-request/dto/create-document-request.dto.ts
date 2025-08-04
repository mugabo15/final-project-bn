import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
} from 'class-validator';
// src/common/enums/document-type.enum.ts
export enum DocumentTypeEnum {
  TRANSCRIPT = 'transcript',
  RECOMMENDATION = 'recommendation',
  TO_WHOM = 'to whom',
  CERTIFICATE_OF_ATTENDANCE = 'certificate of attendance',
  PROOF_OF_ENGLISH = 'proof of english',
  INTERNSHIP = 'internship',
  DEGREE_DIPLOMA = 'degree diploma',
}


export class CreateDocumentRequestDto {
  @ApiProperty({ enum: DocumentTypeEnum })
  @IsOptional()
  documentType: DocumentTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  program: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  level: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  courseName?: string;

//   @ApiProperty({
//     required: false,
//     type: 'array',
//     items: {
//       type: 'object',
//       properties: {
//         level: {
//           type: 'string',
//           enum: [
//             'recoveryOfficer',
//             'library',
//             'staff',
//             'dean',
//             'registrationOfficer',
//             'chancellor',
//             'completed',
//           ],
//         },
//         userId: { type: 'number' },
//         approvedAt: { type: 'string', format: 'date-time' },
//         comment: { type: 'string' },
//       },
//     },
//   })
  @IsOptional()
  @IsArray()
  approvalHistory?: {
    level:
      | 'recoveryOfficer'
      | 'library'
      | 'staff'
      | 'dean'
      | 'registrationOfficer'
      | 'chancellor'
      | 'completed';
    userId: number;
    approvedAt: Date;
    comment?: string;
  }[];
}

export class ApproveDocumentRequestDto {
  @ApiProperty({ description: 'User ID of the approver', required: true })
  @IsOptional()
  userId: number;

  @ApiProperty({ description: 'Role of the approver (e.g., "hod", "dean")' })
  @IsOptional()
  role: string;
}