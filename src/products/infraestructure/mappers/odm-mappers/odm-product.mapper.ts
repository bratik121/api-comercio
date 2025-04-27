import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { OdmProductEntity } from '../../entities/odm-entities/odm-product.entity';
import { Product } from 'src/products/domain/product';
import {
  ProductIdVo,
  ProductNameVo,
  ProductDescriptionVo,
  ProductPriceVo,
  ProductStockVo,
} from 'src/products/domain/value-objects';

export class OdmProductMapper implements IMapper<Product, OdmProductEntity> {
  toDomain(infraEstructure: OdmProductEntity): Product {
    return Product.create(
      ProductIdVo.create(infraEstructure.id),
      ProductNameVo.create(infraEstructure.name),
      ProductDescriptionVo.create(infraEstructure.description),
      ProductPriceVo.create(infraEstructure.price),
      ProductStockVo.create(infraEstructure.stock),
    );
  }

  toPersistence(domainEntity: Product): OdmProductEntity {
    return OdmProductEntity.create(
      domainEntity.getId().getId(),
      domainEntity.getName().getName(),
      domainEntity.getDescription().getDescription(),
      domainEntity.getPrice().getPrice(),
      domainEntity.getStock().getStock(),
    );
  }
}
