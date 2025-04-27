import { IService } from 'src/common/aplication/services/IServices';
import { IOdmProductRepository } from 'src/products/domain/repositories/odm-product.repository.interface';
import { FindProductByIdRequest } from '../dtos/requests/find-product-by-id.request';
import { FindProductByIdResponse } from '../dtos/responses/find-product-by-id.response';
import { Result } from 'src/common/abstractions/result';
import { ProductIdVo } from 'src/products/domain/value-objects';
import { NotFoundProductException } from 'src/products/infraestructure/exceptions';

export class FindProductByIdService extends IService<
  FindProductByIdRequest,
  FindProductByIdResponse
> {
  private readonly _odmProductRepository: IOdmProductRepository;

  constructor(odmProductRepository: IOdmProductRepository) {
    super();
    this._odmProductRepository = odmProductRepository;
  }

  async execute(
    command: FindProductByIdRequest,
  ): Promise<Result<FindProductByIdResponse>> {
    const productId = ProductIdVo.create(command.id);

    const productResult =
      await this._odmProductRepository.findProductById(productId);

    if (productResult.isFailure()) {
      throw productResult.getError();
    }

    const product = productResult.getValue();

    return Result.success<FindProductByIdResponse>(
      new FindProductByIdResponse(
        product.getId().getId(),
        product.getName().getName(),
        product.getDescription().getDescription(),
        product.getPrice().getPrice(),
        product.getStock().getStock(),
      ),
    );
  }
}
