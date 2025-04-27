import { IService } from 'src/common/aplication/services/IServices';
import { CreateOrderRequest } from '../dtos/requests/create-order.request';
import { CreateOrderResponse } from '../dtos/responses/create-order.response';
import { IOdmOrderRepository } from 'src/order/domain/repositories/order/odm-order.repository.interface';
import { IOdmOrderItemRepository } from 'src/order/domain/repositories/order-item/odm-order-item.repository.interface';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';
import { Order } from 'src/order/domain/order';
import {
  OrderIdVo,
  OrderStatus,
  OrderStatusVo,
  OrderTotalPriceVo,
} from 'src/order/domain/value-objects/order';
import { OrderItem } from 'src/order/domain/entities/order-item';
import {
  OrderItemIdVo,
  OrderItemPurchasedPriceVo,
  OrderItemQuantityVo,
} from 'src/order/domain/value-objects/order-item';
import { UserIdVo } from 'src/user/domain/value-objects';
import { Result } from 'src/common/abstractions/result';
import { IOdmProductRepository } from 'src/products/domain/repositories';
import { ProductIdVo } from 'src/products/domain/value-objects';
import { IIdGen } from 'src/common/aplication/id-gen/id-gen.interfaces';
import { InsufficientStockForOrderException } from 'src/order/domain/exceptions';
import {
  IOrmOrderItemRepository,
  IOrmOrderRepository,
} from 'src/order/domain/repositories';

export const OrderStatusMapper = (_status: string): OrderStatus => {
  switch (_status) {
    case 'PENDING':
      return OrderStatus.PENDING;
    case 'CONFIRMED':
      return OrderStatus.CONFIRMED;
    case 'SHIPPED':
      return OrderStatus.SHIPPED;
    case 'CANCELLED':
      return OrderStatus.CANCELLED;
    default:
      return OrderStatus.PENDING;
  }
};

export class CreateOrderService extends IService<
  CreateOrderRequest,
  CreateOrderResponse
> {
  private readonly _odmPorductRepository: IOdmProductRepository;
  private readonly _ormOrderRepository: IOrmOrderRepository;
  private readonly _ormOrderItemRepository: IOrmOrderItemRepository;
  private readonly _eventPublisher: IEventPublisher;
  private readonly genId: IIdGen;

  constructor(
    odmPorductRepository: IOdmProductRepository,
    ormOrderRepository: IOrmOrderRepository,
    ormOrderItemRepository: IOrmOrderItemRepository,
    eventPublisher: IEventPublisher,
    genId: IIdGen,
  ) {
    super();
    this._odmPorductRepository = odmPorductRepository;
    this._ormOrderRepository = ormOrderRepository;
    this._ormOrderItemRepository = ormOrderItemRepository;
    this._eventPublisher = eventPublisher;
    this.genId = genId;
  }

  async execute(
    request: CreateOrderRequest,
  ): Promise<Result<CreateOrderResponse>> {
    const orderId = OrderIdVo.create(await this.genId.genId());
    const userId = UserIdVo.create(request.userId);
    const status = OrderStatusVo.create(OrderStatusMapper(request.status));

    let totalPriceNumber: number = 0;

    const items = request.items;

    let orderItems: OrderItem[] = [];

    //!Calculando total price y agregando OrderItems
    for (const item of items) {
      const productId = ProductIdVo.create(item.id);
      const productResult =
        await this._odmPorductRepository.findProductById(productId);

      if (productResult.isFailure()) {
        throw productResult.getError();
      }

      const product = productResult.getValue();
      totalPriceNumber += product.getPrice().getPrice() * item.quantity;

      if (product.getStock().getStock() < item.quantity) {
        throw new InsufficientStockForOrderException(
          `No hay suficiente stock para el producto ${product.getName().getName()} se necesitan ${item.quantity} pero solo hay ${product.getStock().getStock()} en stock`,
        );
      }

      const orderItem = OrderItem.create(
        OrderItemIdVo.create(await this.genId.genId()),
        OrderIdVo.create(orderId.getId()),
        productId,
        OrderItemPurchasedPriceVo.create(product.getPrice().getPrice()),
        OrderItemQuantityVo.create(item.quantity),
      );

      orderItems.push(orderItem);
    }

    const order = Order.create(
      orderId,
      userId,
      status,
      OrderTotalPriceVo.create(totalPriceNumber),
      orderItems,
    );

    const saveOrderResult = await this._ormOrderRepository.saveOrder(order);
    if (saveOrderResult.isFailure()) {
      throw saveOrderResult.getError();
    }

    for (const orderItem of orderItems) {
      const saveOrderItemResult =
        await this._ormOrderItemRepository.saveOrderItem(orderItem);
      if (saveOrderItemResult.isFailure()) {
        throw saveOrderItemResult.getError();
      }
    }
    order.Register();
    this._eventPublisher.publish(order.pullDomainEvents());

    return Result.success<CreateOrderResponse>(
      new CreateOrderResponse(
        orderId.getId(),
        userId.getId(),
        status.getStatus(),
        totalPriceNumber,
        orderItems.map((item) => ({
          id: item.getId().getId(),
          productId: item.getProduct().getId(),
          purchasedPrice: item.getPurchasedPrice().getPurchasedPrice(),
          quantity: item.getQuantity().getQuantity(),
        })),
      ),
    );
  }
}
