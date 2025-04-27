import { Product } from 'src/products/domain/product';
import { OrmProductEntity } from '../../entities/orm-entities/orm-product.entity';
import {
  ProductIdVo,
  ProductNameVo,
  ProductDescriptionVo,
  ProductPriceVo,
  ProductStockVo,
} from 'src/products/domain/value-objects';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';

export class OrmProductMapper implements IMapper<Product, OrmProductEntity> {
  toPersistence(domainEntity: Product): OrmProductEntity {
    return OrmProductEntity.create(
      domainEntity.getId().getId(),
      domainEntity.getName().getName(),
      domainEntity.getDescription().getDescription(),
      domainEntity.getPrice().getPrice(),
      domainEntity.getStock().getStock(),
    );
  }

  toDomain(infraEstructure: OrmProductEntity): Product {
    return Product.create(
      ProductIdVo.create(infraEstructure.id),
      ProductNameVo.create(infraEstructure.name),
      ProductDescriptionVo.create(infraEstructure.description),
      ProductPriceVo.create(infraEstructure.price),
      ProductStockVo.create(infraEstructure.stock),
    );
  }
}
