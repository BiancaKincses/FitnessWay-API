import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ProductsService } from '../products/products.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { Order, OrderDocument } from './schemas/order.schema'

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
  ) {}

  async create(user: { userId: string; email: string }, dto: CreateOrderDto) {
    if (!dto.items?.length) {
      throw new BadRequestException('Cart is empty')
    }

    // IMPORTANT: tipizare explicită => scapă de "never[]"
    const items: { productId: string; name: string; price: number; qty: number }[] = []
    let total = 0

    for (const it of dto.items) {
      const product = await this.productsService.findOne(it.productId)

      const price = product.price
      total += price * it.qty

      items.push({
        productId: String(product._id),
        name: product.name,
        price,
        qty: it.qty,
      })
    }

    return this.orderModel.create({
      userId: user.userId,
      email: user.email,
      fullName: dto.fullName,
      phone: dto.phone,
      address: dto.address,
      paymentMethod: dto.paymentMethod,
      notes: dto.notes,
      items,
      total,
      status: 'pending',
    })
  }

  async myOrders(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 })
  }

  async allOrders() {
    return this.orderModel.find().sort({ createdAt: -1 })
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true },
    )
    if (!order) throw new NotFoundException('Order not found')
    return order
  }
}
