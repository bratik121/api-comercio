import { ProductRegistered } from 'src/products/domain/events/product-registered.event';
import {
  ProductIdVo,
  ProductNameVo,
  ProductDescriptionVo,
  ProductPriceVo,
  ProductStockVo,
} from 'src/products/domain/value-objects';

export function RegisteredProductMapper(
  json: Record<any, any>,
): ProductRegistered {
  return ProductRegistered.create(
    ProductIdVo.create(json.id.value),
    ProductNameVo.create(json.name.value),
    ProductDescriptionVo.create(json.description.value),
    ProductPriceVo.create(json.price.value),
    ProductStockVo.create(json.stock.value),
  );
}
