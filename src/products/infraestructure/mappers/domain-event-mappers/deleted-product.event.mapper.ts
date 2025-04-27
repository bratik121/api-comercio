import { ProductDeletedEvent } from 'src/products/domain/events/product-deleted.event';
import { ProductIdVo } from 'src/products/domain/value-objects';

export function DeletedProductEventMapper(
  json: Record<any, any>,
): ProductDeletedEvent {
  return ProductDeletedEvent.create(ProductIdVo.create(json.id.value));
}
