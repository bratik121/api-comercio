import { IServiceRequest } from 'src/common/aplication/services/IServices';

export class CreateOrderRequest implements IServiceRequest {
  constructor(
    public readonly userId: string,
    public readonly status: string,
    public readonly items: { id: string; quantity: number }[],
  ) {}

  dataToString(): string {
    return JSON.stringify({
      userId: this.userId,
      status: this.status,
      itemsId: this.items,
    });
  }
}
