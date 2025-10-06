import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsPositive, Min, Length } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Payment amount in the specified currency',
    example: 99.99,
    minimum: 0.01,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Three-letter ISO currency code',
    example: 'USD',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3)
  currency: string;

  @ApiProperty({
    description: 'Unique identifier of the product being purchased',
    example: 'prod_123abc456def',
  })
  // @IsString()
  documentId: string;

  @ApiProperty({
    description: 'Quantity of items to purchase',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
