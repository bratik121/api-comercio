import { IAsyncMapper } from 'src/common/aplication/mappers/async-mapper.interface';
import { OrmOrderEntity } from '../../entities/order/orm-order.entity';
import { Order } from 'src/order/domain/order';
import {
  OrderIdVo,
  OrderStatusVo,
  OrderTotalPriceVo,
} from 'src/order/domain/value-objects/order';
import { IOrmOrderItemRepository } from 'src/order/domain/repositories/order-item/orm-order-item.repository.interface';
import { UserIdVo } from 'src/user/domain/value-objects';

export class OrmOrderMapper implements IAsyncMapper<Order, OrmOrderEntity> {
  private readonly _ormOrderItemRepository: IOrmOrderItemRepository;

  constructor(ormOrderItemRepository: IOrmOrderItemRepository) {
    this._ormOrderItemRepository = ormOrderItemRepository;
  }

  async toDomain(infraEntity: OrmOrderEntity): Promise<Order> {
    const orderItemsResult =
      await this._ormOrderItemRepository.findOrderItemsByOrderId(
        OrderIdVo.create(infraEntity.id),
      );

    if (!orderItemsResult.isSuccess()) {
      throw orderItemsResult.getError();
    }

    const orderItems = orderItemsResult.getValue();

    return Order.create(
      OrderIdVo.create(infraEntity.id),
      UserIdVo.create(infraEntity.id_user),
      OrderStatusVo.create(infraEntity.status),
      OrderTotalPriceVo.create(infraEntity.totalPrice),
      orderItems,
    );
  }

  async toPersistence(domainEntity: Order): Promise<OrmOrderEntity> {
    return OrmOrderEntity.create(
      domainEntity.getId().getId(),
      domainEntity.getUser().getId(),
      domainEntity.getStatus().getStatus(),
      domainEntity.getTotalPrice().getTotalPrice(),
    );
  }
}
