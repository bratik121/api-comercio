import { Model } from 'mongoose';
import { OdmProductEntity } from '../../entities/odm-entities/odm-product.entity';
import { IOdmProductRepository } from 'src/products/domain/repositories/odm-product.repository.interface';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { Product } from 'src/products/domain/product';
import { Result } from 'src/common/abstractions/result';
import { ProductIdVo, ProductNameVo } from 'src/products/domain/value-objects';
import {
  NotFoundProductException,
  SaveProductException,
  UpdateProductException,
} from '../../exceptions';
import { PersistenceException } from 'src/common/exceptions';
import { IPagination } from 'src/common/domain/pagination.interface';

export class OdmProductRepository implements IOdmProductRepository {
  private readonly productModel: Model<OdmProductEntity>;
  private readonly productMapper: IMapper<Product, OdmProductEntity>;

  constructor(
    productModel: Model<OdmProductEntity>,
    productMapper: IMapper<Product, OdmProductEntity>,
  ) {
    this.productModel = productModel;
    this.productMapper = productMapper;
  }

  async findProductById(id: ProductIdVo): Promise<Result<Product>> {
    try {
      console.log('Product mapper', this.productMapper);
      const product = await this.productModel
        .findOne({
          id: id.getId(),
        })
        .exec();
      console.log('product', product);
      if (!product) {
        return Result.fail<Product>(
          new NotFoundProductException(
            `Producto con id ${id.getId()} no encontrado`,
          ),
        );
      }
      return Result.success<Product>(this.productMapper.toDomain(product));
    } catch (error) {
      return Result.fail<Product>(
        new PersistenceException(
          `Error al buscar el producto por id: ${error.message}`,
        ),
      );
    }
  }

  async findProductByName(name: ProductNameVo): Promise<Result<Product>> {
    try {
      const product = await this.productModel
        .findOne({ name: name.getName() })
        .exec();

      if (!product) {
        return Result.fail<Product>(
          new NotFoundProductException(
            `Producto con nombre ${name.getName()} no encontrado`,
          ),
        );
      }
      return Result.success<Product>(this.productMapper.toDomain(product));
    } catch (error) {
      return Result.fail<Product>(
        new PersistenceException(
          `Error al buscar el producto por nombre: ${error.message}`,
        ),
      );
    }
  }

  async findProducts(pagination?: IPagination): Promise<Result<Product[]>> {
    try {
      const query = this.productModel.find();

      // Aplicar paginación si está definida
      if (pagination) {
        if (pagination.limit) {
          query.limit(pagination.limit);
        }
        if (pagination.offset) {
          query.skip(pagination.offset);
        }
      }

      const products = await query.exec();

      return Result.success<Product[]>(
        products.map((product) => this.productMapper.toDomain(product)),
      );
    } catch (error) {
      return Result.fail<Product[]>(
        new PersistenceException(
          `Error al buscar todos los productos: ${error.message}`,
        ),
      );
    }
  }

  async saveProduct(product: Product): Promise<Result<Product>> {
    try {
      const productEntity = this.productMapper.toPersistence(product);
      const savedProduct = await this.productModel.create(productEntity);
      return Result.success<Product>(this.productMapper.toDomain(savedProduct));
    } catch (error) {
      return Result.fail<Product>(
        new SaveProductException(
          `Error al guardar el producto: ${error.message}`,
        ),
      );
    }
  }

  async updateProduct(product: Product): Promise<Result<Product>> {
    try {
      const productEntity = this.productMapper.toPersistence(product);
      const updatedProduct = await this.productModel
        .updateOne({ id: product.getId().getId() }, productEntity)
        .exec();

      if (!updatedProduct) {
        return Result.fail<Product>(
          new NotFoundProductException(
            `Producto con id ${productEntity.id} no encontrado para actualizar`,
          ),
        );
      }

      return Result.success<Product>(product);
    } catch (error) {
      return Result.fail<Product>(
        new UpdateProductException(
          `Error al actualizar el producto: ${error.message}`,
        ),
      );
    }
  }
  async deleteProduct(id: ProductIdVo): Promise<Result<Product>> {
    try {
      const product = await this.productModel
        .findOneAndDelete({ id: id.getId() })
        .exec();

      if (!product) {
        return Result.fail<Product>(
          new NotFoundProductException(
            `Producto con id ${id.getId()} no encontrado`,
          ),
        );
      }

      return Result.success<Product>(this.productMapper.toDomain(product));
    } catch (error) {
      return Result.fail<Product>(
        new PersistenceException(
          `Error al eliminar el producto: ${error.message}`,
        ),
      );
    }
  }
}
