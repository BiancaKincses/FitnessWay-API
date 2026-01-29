import { IsIn } from 'class-validator'

export class UpdateOrderStatusDto {
  @IsIn(['pending', 'paid', 'cancelled'])
  status: 'pending' | 'paid' | 'cancelled'
}
