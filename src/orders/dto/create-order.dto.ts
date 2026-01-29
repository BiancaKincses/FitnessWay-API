import { IsArray, IsIn, IsMongoId, IsNumber, IsOptional, IsString, Min, MinLength, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class CreateOrderItemDto {
  @IsMongoId()
  productId: string

  @IsNumber()
  @Min(1)
  qty: number
}

export class CreateOrderDto {
  @IsString()
  @MinLength(2)
  fullName: string

  @IsString()
  @MinLength(6)
  phone: string

  @IsString()
  @MinLength(5)
  address: string

  @IsIn(['card', 'cash'])
  paymentMethod: 'card' | 'cash'

  @IsOptional()
  @IsString()
  notes?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[]
}
