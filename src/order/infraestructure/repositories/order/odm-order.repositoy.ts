import { Model } from 'mongoose';
import { OdmOrderEntity } from '../../entities/order/odm-order.entity';
import { IOdmOrderRepository } from 'src/order/domain/repositories/order/odm-order.repository.interface';
import { Order } from 'src/order/domain/order';
import { OrderIdVo } from 'src/order/domain/value-objects/order/order-id';
import { UserIdVo } from 'src/user/domain/value-objects';
import { Result } from 'src/common/abstractions/result';
import { IAsyncMapper } from 'src/common/aplication/mappers/async-mapper.interface';
import { PersistenceException } from 'src/common/exceptions';
import { IPagination } from 'src/common/domain/pagination.interface';

export class OdmOrderRepository implements IOdmOrderRepository {
  private readonly orderModel: Model<OdmOrderEntity>;
  private readonly orderMapper: IAsyncMapper<Order, OdmOrderEntity>;

  constructor(
    orderModel: Model<OdmOrderEntity>,
    orderMapper: IAsyncMapper<Order, OdmOrderEntity>,
  ) {
    this.orderModel = orderModel;
    this.orderMapper = orderMapper;
  }

  async saveOrder(order: Order): Promise<Result<Order>> {
    try {
      const odmOrder = await this.orderMapper.toPersistence(order);
      const savedOrder = await this.orderModel.create(odmOrder);
      return Result.success<Order>(await this.orderMapper.toDomain(savedOrder));
    } catch (error) {
      return Result.fail<Order>(
        new PersistenceException(`Error al guardar la orden: ${error.message}`),
      );
    }
  }

  async findOrderById(id: OrderIdVo): Promise<Result<Order>> {
    try {
      const order = await this.orderModel.findOne({ id: id.getId() }).exec();

      if (!order) {
        return Result.fail<Order>(
          new PersistenceException(`Orden con ID ${id.getId()} no encontrada`),
        );
      }

      return Result.success<Order>(await this.orderMapper.toDomain(order));
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
      const query = this.orderModel.find({ userId: userId.getId() });

      if (pagination) {
        query.skip(pagination.offset).limit(pagination.limit);
      }

      const orders = await query.exec();

      return Result.success<Order[]>(
        await Promise.all(
          orders.map((order) => this.orderMapper.toDomain(order)),
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
      const query = this.orderModel.find();

      if (pagination) {
        query.skip(pagination.offset).limit(pagination.limit);
      }

      const orders = await query.exec();

      return Result.success<Order[]>(
        await Promise.all(
          orders.map((order) => this.orderMapper.toDomain(order)),
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
