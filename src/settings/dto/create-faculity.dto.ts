import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class CreateFacultyDto {
    @ApiProperty({ description: 'The ID of the campus this faculty belongs to', example: 1 })
    @IsNotEmpty()
    campusId: number;

    @ApiProperty({ description: 'The name of the faculty',required: false, example: 'Faculty of Engineering' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The number of departments in the faculty',required: false, example: 5 })
    @IsOptional()
    departments?: number;

    @ApiProperty({ description: 'The name of the dean of the faculty',required: false, example: 'Dr. Jane Smith' })
    @IsString()
    @IsOptional()
    dean?: string;

    @ApiProperty({ description: 'stamp for the faculty', required: false, example: 'https://example.com/faculty-stamp.png', format: 'binary' })
    @IsOptional()
    stamp: string;
}