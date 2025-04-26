import { User } from 'src/user/domain/user';
import { UserEmailVo, UserIdVo } from 'src/user/domain/value-objects';
import { EntityManager, Repository } from 'typeorm';
import { NotFoundUserException, SaveUserException } from '../../exceptions';
import { OrmUserEntity } from '../../entities/orm-entities';
import { IOrmUserRepository } from 'src/user/domain/repositories';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { Result } from 'src/common/abstractions/result';
import { PersistenceException } from 'src/common/exceptions';

export class OrmUserRepository
  extends Repository<OrmUserEntity>
  implements IOrmUserRepository
{
  private _ormUserMapper: IMapper<User, OrmUserEntity>;
  constructor(
    manager: EntityManager,
    ormUserMapper: IMapper<User, OrmUserEntity>,
  ) {
    super(OrmUserEntity, manager);
    this._ormUserMapper = ormUserMapper;
  }

  async findAllUser(): Promise<Result<User[]>> {
    try {
      const users = await this.find({
        select: ['id', 'email', 'password', 'name'],
      });
      return Result.success<User[]>(
        users.map((user) => this._ormUserMapper.toDomain(user)),
      );
    } catch (error) {
      return Result.fail<User[]>(
        new PersistenceException(`No se encontraron usuarios`),
      );
    }
  }

  async findUserByEmail(email: UserEmailVo): Promise<Result<User>> {
    try {
      const user = await this.findOne({
        select: ['id', 'email', 'password', 'name'],
        where: { email: email.getEmail() },
      });

      if (!user) {
        return Result.fail<User>(
          new NotFoundUserException(
            `User with email ${email.getEmail()} not found`,
          ),
        );
      }

      return Result.success<User>(this._ormUserMapper.toDomain(user));
    } catch (error) {
      return Result.fail<User>(
        new PersistenceException(
          `Error al buscar el usuario por email: ${error.message}`,
        ),
      );
    }
  }

  async findUserById(id: UserIdVo): Promise<Result<User>> {
    try {
      const user = await this.findOne({
        select: ['id', 'email', 'password', 'name'],
        where: { id: id.getId() },
      });

      if (!user) {
        return Result.fail<User>(
          new NotFoundUserException(`User with id ${id.getId()} not found`),
        );
      }
      return Result.success<User>(this._ormUserMapper.toDomain(user));
    } catch (error) {
      return Result.fail<User>(
        new PersistenceException(
          `Error al buscar el usuario por id: ${error.message}`,
        ),
      );
    }
  }

  async saveUser(user: User): Promise<Result<User>> {
    try {
      const ormUser = this._ormUserMapper.toPersistence(user);
      const savedUser = await this.save(ormUser);
      return Result.success<User>(this._ormUserMapper.toDomain(savedUser));
    } catch (error) {
      return Result.fail<User>(
        new SaveUserException(`Erro al guardar el usuario: ${error.message}`),
      );
    }
  }
}
