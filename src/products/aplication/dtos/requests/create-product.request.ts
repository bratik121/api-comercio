import { IServiceRequest } from 'src/common/aplication/services/IServices';

export class CreateProductRequest implements IServiceRequest {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly stock: number,
  ) {}

  dataToString(): string {
    return `name: ${this.name}, description: ${this.description}, price: ${this.price}, stock: ${this.stock}`;
  }
}
