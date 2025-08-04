import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ssword123' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: '221003571/2023' })
  @IsOptional()
  @IsString()
  regNumber?: string;

  @ApiPropertyOptional({ example: '2025-07-24' })
  @IsOptional()
  registrationDate?: Date;

  @ApiPropertyOptional({ example: 'Paul Doe' })
  @IsOptional()
  @IsString()
  fatherName?: string;

  @ApiPropertyOptional({ example: 'Mary Doe' })
  @IsOptional()
  @IsString()
  motherName?: string;

  @ApiPropertyOptional({ enum: ['male', 'female'], example: 'male' })
  @IsOptional()
  @IsEnum(['male', 'female'])
  gender?: 'male' | 'female';

  @ApiPropertyOptional({ example: '1199480099999021' })
  @IsOptional()
  @IsString()
  idCardNumber?: string;

  @ApiPropertyOptional({ example: 'Rwandan' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ example: '2002-10-15' })
  @IsOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({ example: '+250788123456' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'Year 1' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({
    enum: ['day', 'evening', 'weekend'],
    example: 'day',
  })
  @IsOptional()
  @IsEnum(['day', 'evening', 'weekend'])
  program?: 'day' | 'evening' | 'weekend';

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  campusId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  schoolId?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  departmentId?: number;
}
