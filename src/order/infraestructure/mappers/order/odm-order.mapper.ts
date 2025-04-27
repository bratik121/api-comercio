import { IAsyncMapper } from 'src/common/aplication/mappers/async-mapper.interface';
import { OdmOrderEntity } from '../../entities/order/odm-order.entity';
import { Order } from 'src/order/domain/order';
import {
  OrderIdVo,
  OrderStatusVo,
  OrderTotalPriceVo,
} from 'src/order/domain/value-objects/order';
import { IOdmOrderItemRepository } from 'src/order/domain/repositories/order-item/odm-order-item.repository.interface';
import { UserIdVo } from 'src/user/domain/value-objects';

export class OdmOrderMapper implements IAsyncMapper<Order, OdmOrderEntity> {
  private readonly _odmOrderItemRepository: IOdmOrderItemRepository;

  constructor(odmOrderItemRepository: IOdmOrderItemRepository) {
    this._odmOrderItemRepository = odmOrderItemRepository;
  }

  async toDomain(infraEntity: OdmOrderEntity): Promise<Order> {
    const orderItemsResult =
      await this._odmOrderItemRepository.findOrderItemsByOrderId(
        OrderIdVo.create(infraEntity.id),
      );

    if (!orderItemsResult.isSuccess()) {
      throw orderItemsResult.getError();
    }

    const orderItems = orderItemsResult.getValue();

    return Order.create(
      OrderIdVo.create(infraEntity.id),
      UserIdVo.create(infraEntity.userId),
      OrderStatusVo.create(infraEntity.status),
      OrderTotalPriceVo.create(infraEntity.totalPrice),
      orderItems,
    );
  }

  async toPersistence(domainEntity: Order): Promise<OdmOrderEntity> {
    return OdmOrderEntity.create(
      domainEntity.getId().getId(),
      domainEntity.getUser().getId(),
      domainEntity.getStatus().getStatus(),
      domainEntity.getTotalPrice().getTotalPrice(),
    );
  }
}
