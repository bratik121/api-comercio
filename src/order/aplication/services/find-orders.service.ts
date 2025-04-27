import { IService } from 'src/common/aplication/services/IServices';
import { FindOrdersRequest } from '../dtos/requests/find-orders.request';
import { FindOrdersResponse } from '../dtos/responses/find-orders.response';
import { IOrmOrderRepository } from 'src/order/domain/repositories/order/orm-order.repository.interface';
import { Result } from 'src/common/abstractions/result';

export class FindOrdersService extends IService<
  FindOrdersRequest,
  FindOrdersResponse
> {
  constructor(private readonly _ormOrderRepository: IOrmOrderRepository) {
    super();
  }

  async execute(
    request: FindOrdersRequest,
  ): Promise<Result<FindOrdersResponse>> {
    const ordersResult = await this._ormOrderRepository.findOrders(
      request.pagination,
    );

    if (ordersResult.isFailure()) {
      throw ordersResult.getError();
    }

    const orders = ordersResult.getValue();

    return Result.success<FindOrdersResponse>(
      new FindOrdersResponse(
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
