import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export type UserRoles =
  | 'student'
  | 'staff'
  | 'dean'
  | 'hod'
  | 'director_of_languages'
  | 'librarian'
  | 'finance'
  | 'registrationOfficer'
  | 'recoveryOfficer'
  | 'admin'
  | 'chancellor';

export class CreateStaffDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Niyonsaba' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'alice.niyonsaba@university.rw' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecureStaffPass456' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: 'Senior Librarian' })
  @IsOptional()
  @IsString()
  staffPosition?: string;

  @ApiPropertyOptional({
    description: 'Role assigned to the staff member',
    enum: [
      'student',
      'staff',
      'dean',
      'hod',
      'director_of_languages',
      'librarian',
      'finance',
      'registrationOfficer',
      'recoveryOfficer',
      'admin',
      'chancellor'
    ],
    example: 'chancellor',
  })
  @IsOptional()
  roles?: UserRole;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  campusId?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  schoolId?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({ example: '+250788765432' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/signature.png',
    format: 'binary',
    description: 'User signature image (optional)',
  })
  @IsOptional()
  @IsString()
  signature?: string;
}
