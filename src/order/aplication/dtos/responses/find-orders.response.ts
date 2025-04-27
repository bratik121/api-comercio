import { IServiceResponse } from 'src/common/aplication/services/IServices';

export class FindOrdersResponse implements IServiceResponse {
  constructor(
    public readonly orders: {
      id: string;
      userId: string;
      status: string;
      totalPrice: number;
      items: {
        id: string;
        productId: string;
        purchasedPrice: number;
        quantity: number;
      }[];
    }[],
  ) {}

  dataToString(): string {
    return JSON.stringify(this.orders);
  }
}
