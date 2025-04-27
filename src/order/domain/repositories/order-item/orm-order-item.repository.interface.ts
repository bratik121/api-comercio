import { OrderItem } from '../../entities/order-item';
import { OrderIdVo } from '../../value-objects/order/order-id';
import { Result } from 'src/common/abstractions/result';

export interface IOrmOrderItemRepository {
  saveOrderItem(
    orderItem: OrderItem,
    orderId: OrderIdVo,
  ): Promise<Result<OrderItem>>;
  findOrderItemsByOrderId(orderId: OrderIdVo): Promise<Result<OrderItem[]>>;
}
