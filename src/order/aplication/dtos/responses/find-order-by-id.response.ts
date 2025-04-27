import { IServiceResponse } from 'src/common/aplication/services/IServices';

export class FindOrderByIdResponse implements IServiceResponse {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly status: string,
    public readonly totalPrice: number,
    public readonly items: {
      id: string;
      productId: string;
      purchasedPrice: number;
      quantity: number;
    }[],
  ) {}

  dataToString(): string {
    return JSON.stringify({
      id: this.id,
      userId: this.userId,
      status: this.status,
      totalPrice: this.totalPrice,
      items: this.items,
    });
  }
}
