import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { OrderItem } from 'src/order/domain/entities/order-item';
import { OrmOrderItemEntity } from 'src/order/infraestructure/entities/order-item/orm-order-item.entity';
import {
  OrderItemIdVo,
  OrderItemPurchasedPriceVo,
  OrderItemQuantityVo,
} from 'src/order/domain/value-objects/order-item';
import { ProductIdVo } from 'src/products/domain/value-objects';
import { OrderIdVo } from 'src/order/domain/value-objects';

export class OrmOrderItemMapper
  implements IMapper<OrderItem, OrmOrderItemEntity>
{
  toDomain(entity: OrmOrderItemEntity): OrderItem {
    return OrderItem.create(
      OrderItemIdVo.create(entity.id),
      OrderIdVo.create(entity.order.id),
      ProductIdVo.create(entity.product.id),
      OrderItemPurchasedPriceVo.create(entity.purchasedPrice),
      OrderItemQuantityVo.create(entity.quantity),
    );
  }

  toPersistence(domain: OrderItem): OrmOrderItemEntity {
    console.log('toPersistence', domain);
    const entity = new OrmOrderItemEntity();
    entity.id = domain.getId().getId();
    entity.id_order = domain.getOrder().getId();
    entity.id_product = domain.getProduct().getId();
    entity.purchasedPrice = domain.getPurchasedPrice().getPurchasedPrice();
    entity.quantity = domain.getQuantity().getQuantity();
    return entity;
  }
}
