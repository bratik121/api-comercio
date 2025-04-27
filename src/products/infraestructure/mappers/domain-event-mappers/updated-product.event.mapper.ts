import { ProductUpdatedEvent } from 'src/products/domain/events/product-updated.event';
import {
  ProductIdVo,
  ProductNameVo,
  ProductDescriptionVo,
  ProductPriceVo,
  ProductStockVo,
} from 'src/products/domain/value-objects';
import { Optional } from 'src/common/abstractions/optional';

export function UpdatedProductEventMapper(
  json: Record<any, any>,
): ProductUpdatedEvent {
  const optionalName = new Optional<string>(json.name?.value);
  const optionalDescription = new Optional<string>(json.description?.value);
  const optionalPrice = new Optional<number>(json.price?.value);
  const optionalStock = new Optional<number>(json.stock?.value);

  return ProductUpdatedEvent.create(
    ProductIdVo.create(json.id.value),
    optionalName.hasValue()
      ? ProductNameVo.create(optionalName.getValue())
      : undefined,
    optionalDescription.hasValue()
      ? ProductDescriptionVo.create(optionalDescription.getValue())
      : undefined,
    optionalPrice.hasValue()
      ? ProductPriceVo.create(optionalPrice.getValue())
      : undefined,
    optionalStock.hasValue()
      ? ProductStockVo.create(optionalStock.getValue()!)
      : undefined,
  );
}
