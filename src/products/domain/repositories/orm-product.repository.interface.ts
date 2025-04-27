import { ProductIdVo, ProductNameVo } from '../value-objects';
import { Product } from '../product';
import { Result } from 'src/common/abstractions/result';
import { IPagination } from 'src/common/domain/pagination.interface';

export interface IOrmProductRepository {
  findProductById(id: ProductIdVo): Promise<Result<Product>>;
  findProductByName(name: ProductNameVo): Promise<Result<Product>>;
  saveProduct(product: Product): Promise<Result<Product>>;
  updateProduct(product: Product): Promise<Result<Product>>;
  findProducts(pagination?: IPagination): Promise<Result<Product[]>>;
}
