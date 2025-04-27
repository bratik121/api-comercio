import { IServiceRequest } from 'src/common/aplication/services/IServices';

export class FindProductByIdRequest implements IServiceRequest {
  constructor(public readonly id: string) {}

  dataToString(): string {
    return `Product ID: ${this.id}`;
  }
}
