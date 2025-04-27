import { EntityManager, Repository } from 'typeorm';
import { OrmOrderEntity } from '../../entities/order/orm-order.entity';
import { IOrmOrderRepository } from 'src/order/domain/repositories/order/orm-order.repository.interface';
import { Order } from 'src/order/domain/order';
import { OrderIdVo } from 'src/order/domain/value-objects/order/order-id';
import { UserIdVo } from 'src/user/domain/value-objects';
import { Result } from 'src/common/abstractions/result';
import { IAsyncMapper } from 'src/common/aplication/mappers/async-mapper.interface';
import { PersistenceException } from 'src/common/exceptions';
import { IPagination } from 'src/common/domain/pagination.interface';

export class OrmOrderRepository
  extends Repository<OrmOrderEntity>
  implements IOrmOrderRepository
{
  private readonly _ormOrderMapper: IAsyncMapper<Order, OrmOrderEntity>;

  constructor(
    manager: EntityManager,
    ormOrderMapper: IAsyncMapper<Order, OrmOrderEntity>,
  ) {
    super(OrmOrderEntity, manager);
    this._ormOrderMapper = ormOrderMapper;
  }

  async saveOrder(order: Order): Promise<Result<Order>> {
    try {
      const ormOrder = await this._ormOrderMapper.toPersistence(order);
      const savedOrder = await this.save(ormOrder);
      return Result.success<Order>(
        await this._ormOrderMapper.toDomain(savedOrder),
      );
    } catch (error) {
      return Result.fail<Order>(
        new PersistenceException(`Error al guardar la orden: ${error.message}`),
      );
    }
  }

  async findOrderById(id: OrderIdVo): Promise<Result<Order>> {
    try {
      const order = await this.findOne({ where: { id: id.getId() } });

      if (!order) {
        return Result.fail<Order>(
          new PersistenceException(`Orden con ID ${id.getId()} no encontrada`),
        );
      }

      return Result.success<Order>(await this._ormOrderMapper.toDomain(order));
    } catch (error) {
      return Result.fail<Order>(
        new PersistenceException(
          `Error al buscar la orden por ID: ${error.message}`,
        ),
      );
    }
  }

  async findOrdersByUserId(
    userId: UserIdVo,
    pagination?: IPagination,
  ): Promise<Result<Order[]>> {
    try {
      const query = this.createQueryBuilder('order').where(
        'order.id_user = :userId',
        { userId: userId.getId() },
      );

      if (pagination) {
        query.skip(pagination.offset).take(pagination.limit);
      }

      const orders = await query.getMany();

      return Result.success<Order[]>(
        await Promise.all(
          orders.map((order) => this._ormOrderMapper.toDomain(order)),
        ),
      );
    } catch (error) {
      return Result.fail<Order[]>(
        new PersistenceException(
          `Error al buscar las órdenes del usuario con ID ${userId.getId()}: ${error.message}`,
        ),
      );
    }
  }

  async findOrders(pagination?: IPagination): Promise<Result<Order[]>> {
    try {
      const query = this.createQueryBuilder('order');

      if (pagination) {
        query.skip(pagination.offset).take(pagination.limit);
      }

      const orders = await query.getMany();

      return Result.success<Order[]>(
        await Promise.all(
          orders.map((order) => this._ormOrderMapper.toDomain(order)),
        ),
      );
    } catch (error) {
      return Result.fail<Order[]>(
        new PersistenceException(
          `Error al buscar las órdenes: ${error.message}`,
        ),
      );
    }
  }
}
