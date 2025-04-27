import { IService } from 'src/common/aplication/services/IServices';
import { FindOrdersByIdUserRequest } from '../dtos/requests/find-orders-by-id-user.request';
import { FindOrdersByIdUserResponse } from '../dtos/responses/find-orders-by-id-user.response';
import { IOrmOrderRepository } from 'src/order/domain/repositories/order/orm-order.repository.interface';
import { UserIdVo } from 'src/user/domain/value-objects';
import { Result } from 'src/common/abstractions/result';

export class FindOrdersByUserIdService extends IService<
  FindOrdersByIdUserRequest,
  FindOrdersByIdUserResponse
> {
  constructor(private readonly _ormOrderRepository: IOrmOrderRepository) {
    super();
  }

  async execute(
    request: FindOrdersByIdUserRequest,
  ): Promise<Result<FindOrdersByIdUserResponse>> {
    const userId = UserIdVo.create(request.userId);

    const ordersResult = await this._ormOrderRepository.findOrdersByUserId(
      userId,
      request.pagination,
    );

    if (ordersResult.isFailure()) {
      throw ordersResult.getError();
    }

    const orders = ordersResult.getValue();

    return Result.success<FindOrdersByIdUserResponse>(
      new FindOrdersByIdUserResponse(
        orders.map((order) => ({
          id: order.getId().getId(),
          userId: order.getUser().getId(),
          status: order.getStatus().getStatus(),
          totalPrice: order.getTotalPrice().getTotalPrice(),
          items: order.getOrderItems().map((item) => ({
            id: item.getId().getId(),
            productId: item.getProduct().getId(),
            purchasedPrice: item.getPurchasedPrice().getPurchasedPrice(),
            quantity: item.getQuantity().getQuantity(),
          })),
        })),
      ),
    );
  }
}
