import { IServiceRequest } from 'src/common/aplication/services/IServices';
import { IPagination } from 'src/common/domain/pagination.interface';

export class FindOrdersByIdUserRequest implements IServiceRequest {
  constructor(
    public readonly userId: string,
    public readonly pagination?: IPagination,
  ) {}

  dataToString(): string {
    return this.pagination
      ? `User ID: ${this.userId}, Pagination - Limit: ${this.pagination.limit}, Offset: ${this.pagination.offset}`
      : `User ID: ${this.userId}, No pagination provided`;
  }
}
