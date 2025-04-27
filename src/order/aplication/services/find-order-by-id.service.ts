import { IService } from 'src/common/aplication/services/IServices';

import { IOrmOrderRepository } from 'src/order/domain/repositories/order/orm-order.repository.interface';
import { OrderIdVo } from 'src/order/domain/value-objects/order/order-id';
import { Result } from 'src/common/abstractions/result';
import { FindOrderByIdRequest, FindOrderByIdResponse } from '../dtos';

export class FindOrderByIdService extends IService<
  FindOrderByIdRequest,
  FindOrderByIdResponse
> {
  constructor(private readonly _ormOrderRepository: IOrmOrderRepository) {
    super();
  }

  async execute(
    request: FindOrderByIdRequest,
  ): Promise<Result<FindOrderByIdResponse>> {
    const orderId = OrderIdVo.create(request.orderId);

    const orderResult = await this._ormOrderRepository.findOrderById(orderId);

    if (orderResult.isFailure()) {
      throw orderResult.getError();
    }

    const order = orderResult.getValue();

    return Result.success<FindOrderByIdResponse>(
      new FindOrderByIdResponse(
        order.getId().getId(),
        order.getUser().getId(),
        order.getStatus().getStatus(),
        order.getTotalPrice().getTotalPrice(),
        order.getOrderItems().map((item) => ({
          id: item.getId().getId(),
          productId: item.getProduct().getId(),
          purchasedPrice: item.getPurchasedPrice().getPurchasedPrice(),
          quantity: item.getQuantity().getQuantity(),
        })),
      ),
    );
  }
}
