import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateFacultyDto {
    @ApiProperty({ description: 'The ID of the campus this faculty belongs to', example: 1 })
    @IsNotEmpty()
    campusId: number;

    @ApiProperty({ description: 'The name of the faculty', example: 'Faculty of Engineering' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'The number of departments in the faculty', example: 5 })
     
    @IsOptional()
    departments?: number;

    @ApiProperty({ description: 'The name of the dean of the faculty', example: 'Dr. Jane Smith' })
    @IsString()
    @IsOptional()
    dean?: string;
}