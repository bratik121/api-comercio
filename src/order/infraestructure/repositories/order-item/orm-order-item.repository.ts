import { EntityManager, Repository } from 'typeorm';
import { OrmOrderItemEntity } from '../../entities/order-item/orm-order-item.entity';
import { IOrmOrderItemRepository } from 'src/order/domain/repositories/order-item/orm-order-item.repository.interface';
import { OrderItem } from 'src/order/domain/entities/order-item';
import { OrderIdVo } from 'src/order/domain/value-objects/order/order-id';
import { Result } from 'src/common/abstractions/result';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { PersistenceException } from 'src/common/exceptions';

export class OrmOrderItemRepository
  extends Repository<OrmOrderItemEntity>
  implements IOrmOrderItemRepository
{
  private readonly _ormOrderItemMapper: IMapper<OrderItem, OrmOrderItemEntity>;

  constructor(
    manager: EntityManager,
    ormOrderItemMapper: IMapper<OrderItem, OrmOrderItemEntity>,
  ) {
    super(OrmOrderItemEntity, manager);
    this._ormOrderItemMapper = ormOrderItemMapper;
  }

  async saveOrderItem(orderItem: OrderItem): Promise<Result<OrderItem>> {
    try {
      const ormOrderItem = this._ormOrderItemMapper.toPersistence(orderItem);

      const savedOrderItem = await this.save(ormOrderItem);
      return Result.success<OrderItem>(orderItem);
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
      const orderItems = await this.find({
        where: { id_order: orderId.getId() },
      });

      return Result.success<OrderItem[]>(
        orderItems.map((item) => this._ormOrderItemMapper.toDomain(item)),
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
