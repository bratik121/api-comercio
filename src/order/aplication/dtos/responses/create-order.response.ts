import { IServiceResponse } from 'src/common/aplication/services/IServices';

export class CreateOrderResponse implements IServiceResponse {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly status: string,
    public readonly totalPrice: number,
    public readonly orderItems: {
      id: string;
      productId: string;
      purchasedPrice: number;
      quantity: number;
    }[],
  ) {}

  dataToString(): string {
    return `Orden creada con ID: ${this.id}, Usuario: ${this.userId}, Estado: ${this.status}, Precio total: ${this.totalPrice}, Items de la orden: ${JSON.stringify(
      this.orderItems,
    )}`;
  }
}
