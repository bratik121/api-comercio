import { IServiceRequest } from 'src/common/aplication/services/IServices';

export class UpdateProductRequest implements IServiceRequest {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly price?: number,
    public readonly stock?: number,
  ) {}

  dataToString(): string {
    return `Product ID: ${this.id}, Name: ${this.name || 'N/A'}, Description: ${
      this.description || 'N/A'
    }, Price: ${this.price || 'N/A'}, Stock: ${this.stock || 'N/A'}`;
  }
}
