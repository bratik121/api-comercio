import { IService } from 'src/common/aplication/services/IServices';
import { IOdmProductRepository } from 'src/products/domain/repositories/odm-product.repository.interface';
import { FindProductsRequest } from '../dtos/requests/find-products.request';
import { FindProductsResponse } from '../dtos/responses/find-products.response';
import { Result } from 'src/common/abstractions/result';
import { IPagination } from 'src/common/domain/pagination.interface';

export class FindProductsService extends IService<
  FindProductsRequest,
  FindProductsResponse
> {
  private readonly _odmProductRepository: IOdmProductRepository;

  constructor(odmProductRepository: IOdmProductRepository) {
    super();
    this._odmProductRepository = odmProductRepository;
  }

  async execute(
    command: FindProductsRequest,
  ): Promise<Result<FindProductsResponse>> {
    const pagination = command.pagination;

    const productsResult =
      await this._odmProductRepository.findProducts(pagination);

    if (productsResult.isFailure()) {
      return Result.fail<FindProductsResponse>(productsResult.getError());
    }

    const products = productsResult.getValue();

    const response = new FindProductsResponse(
      products.map((product) => ({
        id: product.getId().getId(),
        name: product.getName().getName(),
        description: product.getDescription().getDescription(),
        price: product.getPrice().getPrice(),
        stock: product.getStock().getStock(),
      })),
    );

    return Result.success<FindProductsResponse>(response);
  }
}
