import { Product } from 'src/products/domain/product';
import { ProductIdVo, ProductNameVo } from 'src/products/domain/value-objects';
import { EntityManager, Repository } from 'typeorm';
import {
  NotFoundProductException,
  SaveProductException,
  UpdateProductException,
} from '../../exceptions';
import { OrmProductEntity } from '../../entities/orm-entities/orm-product.entity';
import { IOrmProductRepository } from 'src/products/domain/repositories/orm-product.repository.interface';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { Result } from 'src/common/abstractions/result';
import { PersistenceException } from 'src/common/exceptions';
import { IPagination } from 'src/common/domain/pagination.interface';

export class OrmProductRepository
  extends Repository<OrmProductEntity>
  implements IOrmProductRepository
{
  private _ormProductMapper: IMapper<Product, OrmProductEntity>;

  constructor(
    manager: EntityManager,
    ormProductMapper: IMapper<Product, OrmProductEntity>,
  ) {
    super(OrmProductEntity, manager);
    this._ormProductMapper = ormProductMapper;
  }

  async findProductById(id: ProductIdVo): Promise<Result<Product>> {
    try {
      const product = await this.findOne({
        select: ['id', 'name', 'description', 'price', 'stock'],
        where: { id: id.getId() },
      });

      if (!product) {
        return Result.fail<Product>(
          new NotFoundProductException(
            `Producto con id ${id.getId()} no encontrado`,
          ),
        );
      }

      return Result.success<Product>(this._ormProductMapper.toDomain(product));
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
      const product = await this.findOne({
        select: ['id', 'name', 'description', 'price', 'stock'],
        where: { name: name.getName() },
      });

      if (!product) {
        return Result.fail<Product>(
          new NotFoundProductException(
            `Producto con nombre ${name.getName()} no encontrado`,
          ),
        );
      }

      return Result.success<Product>(this._ormProductMapper.toDomain(product));
    } catch (error) {
      return Result.fail<Product>(
        new PersistenceException(
          `Error al buscar el producto por nombre: ${error.message}`,
        ),
      );
    }
  }

  async saveProduct(product: Product): Promise<Result<Product>> {
    try {
      const ormProduct = this._ormProductMapper.toPersistence(product);
      const savedProduct = await this.save(ormProduct);
      return Result.success<Product>(
        this._ormProductMapper.toDomain(savedProduct),
      );
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
      const ormProduct = this._ormProductMapper.toPersistence(product);
      const updatedProduct = await this.save(ormProduct);
      return Result.success<Product>(
        this._ormProductMapper.toDomain(updatedProduct),
      );
    } catch (error) {
      return Result.fail<Product>(
        new UpdateProductException(
          `Error al actualizar el producto: ${error.message}`,
        ),
      );
    }
  }

  async findProducts(pagination?: IPagination): Promise<Result<Product[]>> {
    try {
      const products = await this.find({
        select: ['id', 'name', 'description', 'price', 'stock'],
        skip: pagination?.offset,
        take: pagination?.limit,
      });

      return Result.success<Product[]>(
        products.map((product) => this._ormProductMapper.toDomain(product)),
      );
    } catch (error) {
      return Result.fail<Product[]>(
        new PersistenceException(
          `Error al buscar los productos: ${error.message}`,
        ),
      );
    }
  }

  async deleteProduct(id: ProductIdVo): Promise<Result<Product>> {
    try {
      const product = await this.findOne({
        select: ['id', 'name', 'description', 'price', 'stock'],
        where: { id: id.getId() },
      });

      if (!product) {
        return Result.fail<Product>(
          new NotFoundProductException(
            `Producto con id ${id.getId()} no encontrado`,
          ),
        );
      }
      const domainProduct = this._ormProductMapper.toDomain(product);

      await this.remove(product);

      return Result.success<Product>(domainProduct);
    } catch (error) {
      return Result.fail<Product>(
        new PersistenceException(
          `Error al eliminar el producto: ${error.message}`,
        ),
      );
    }
  }
}
