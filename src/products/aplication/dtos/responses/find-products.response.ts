import { IServiceResponse } from 'src/common/aplication/services/IServices';

export class FindProductsResponse implements IServiceResponse {
  constructor(
    private readonly products: {
      id: string;
      name: string;
      description: string;
      price: number;
      stock: number;
    }[],
  ) {}

  dataToString(): string {
    return this.products
      .map(
        (product) =>
          `Product: "${product.name}" with description: "${product.description}", price: ${product.price}, stock: ${product.stock}, ID: ${product.id}`,
      )
      .join('\n');
  }
}
