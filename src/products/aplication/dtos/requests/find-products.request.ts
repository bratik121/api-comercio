import { IServiceRequest } from 'src/common/aplication/services/IServices';
import { IPagination } from 'src/common/domain/pagination.interface';

export class FindProductsRequest implements IServiceRequest {
  constructor(public readonly pagination?: IPagination) {}

  dataToString(): string {
    return this.pagination
      ? `Pagination - Limit: ${this.pagination.limit}, Offset: ${this.pagination.offset}`
      : 'No pagination provided';
  }
}
