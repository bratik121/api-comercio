import { Order } from '../../order';
import { OrderIdVo } from '../../value-objects/order/order-id';
import { UserIdVo } from 'src/user/domain/value-objects';
import { Result } from 'src/common/abstractions/result';
import { IPagination } from 'src/common/domain/pagination.interface';

export interface IOrmOrderRepository {
  saveOrder(order: Order): Promise<Result<Order>>;
  findOrderById(id: OrderIdVo): Promise<Result<Order>>;
  findOrdersByUserId(
    userId: UserIdVo,
    pagination?: IPagination,
  ): Promise<Result<Order[]>>;
  findOrders(pagination?: IPagination): Promise<Result<Order[]>>;
}
