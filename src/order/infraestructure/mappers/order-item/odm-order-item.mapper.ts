import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { OrderItem } from 'src/order/domain/entities/order-item';
import { OdmOrderItemEntity } from 'src/order/infraestructure/entities/order-item/odm-order-item.entity';
import {
  OrderItemIdVo,
  OrderItemPurchasedPriceVo,
  OrderItemQuantityVo,
} from 'src/order/domain/value-objects/order-item';
import { ProductIdVo } from 'src/products/domain/value-objects';
import { OrderIdVo } from 'src/order/domain/value-objects';

export class OdmOrderItemMapper
  implements IMapper<OrderItem, OdmOrderItemEntity>
{
  toDomain(entity: OdmOrderItemEntity): OrderItem {
    return OrderItem.create(
      OrderItemIdVo.create(entity.id),
      OrderIdVo.create(entity.orderId),
      ProductIdVo.create(entity.productId),
      OrderItemPurchasedPriceVo.create(entity.purchasedPrice),
      OrderItemQuantityVo.create(entity.quantity),
    );
  }

  toPersistence(domain: OrderItem): OdmOrderItemEntity {
    const entity = new OdmOrderItemEntity();
    entity.id = domain.getId().getId();
    entity.orderId = domain.getOrder().getId();
    entity.productId = domain.getProduct().getId();
    entity.purchasedPrice = domain.getPurchasedPrice().getPurchasedPrice();
    entity.quantity = domain.getQuantity().getQuantity();
    return entity;
  }
}
