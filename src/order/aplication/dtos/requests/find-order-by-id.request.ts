import { IServiceRequest } from 'src/common/aplication/services/IServices';

export class FindOrderByIdRequest implements IServiceRequest {
  constructor(public readonly orderId: string) {}

  dataToString(): string {
    return `Order ID: ${this.orderId}`;
  }
}
