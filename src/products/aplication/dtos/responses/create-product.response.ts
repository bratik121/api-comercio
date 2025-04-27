import { IServiceResponse } from 'src/common/aplication/services/IServices';

export class CreateProductResponse implements IServiceResponse {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly description: string,
    private readonly price: number,
    private readonly stock: number,
  ) {}

  dataToString(): string {
    return `Product: "${this.name}" with description: "${this.description}", price: ${this.price}, stock: ${this.stock} created with id: ${this.id}`;
  }
}
