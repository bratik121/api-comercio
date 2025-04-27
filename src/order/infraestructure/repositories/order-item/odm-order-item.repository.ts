import { Model } from 'mongoose';
import { OdmOrderItemEntity } from '../../entities/order-item/odm-order-item.entity';
import { IOdmOrderItemRepository } from 'src/order/domain/repositories/order-item/odm-order-item.repository.interface';
import { OrderItem } from 'src/order/domain/entities/order-item';
import { OrderIdVo } from 'src/order/domain/value-objects/order/order-id';
import { Result } from 'src/common/abstractions/result';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { PersistenceException } from 'src/common/exceptions';

export class OdmOrderItemRepository implements IOdmOrderItemRepository {
  private readonly orderItemModel: Model<OdmOrderItemEntity>;
  private readonly orderItemMapper: IMapper<OrderItem, OdmOrderItemEntity>;

  constructor(
    orderItemModel: Model<OdmOrderItemEntity>,
    orderItemMapper: IMapper<OrderItem, OdmOrderItemEntity>,
  ) {
    this.orderItemModel = orderItemModel;
    this.orderItemMapper = orderItemMapper;
  }

  async saveOrderItem(
    orderItem: OrderItem,
    orderId: OrderIdVo,
  ): Promise<Result<OrderItem>> {
    try {
      const odmOrderItem = this.orderItemMapper.toPersistence(orderItem);
      odmOrderItem.orderId = orderId.getId();
      const savedOrderItem = await this.orderItemModel.create(odmOrderItem);
      return Result.success<OrderItem>(
        this.orderItemMapper.toDomain(savedOrderItem),
      );
    } catch (error) {
      return Result.fail<OrderItem>(
        new PersistenceException(
          `Error al guardar el artículo de la orden: ${error.message}`,
        ),
      );
    }
  }

  async findOrderItemsByOrderId(
    orderId: OrderIdVo,
  ): Promise<Result<OrderItem[]>> {
    try {
      const orderItems = await this.orderItemModel
        .find({ orderId: orderId.getId() })
        .exec();

      return Result.success<OrderItem[]>(
        orderItems.map((item) => this.orderItemMapper.toDomain(item)),
      );
    } catch (error) {
      return Result.fail<OrderItem[]>(
        new PersistenceException(
          `Error al buscar los artículos de la orden con ID ${orderId.getId()}: ${error.message}`,
        ),
      );
    }
  }
}
