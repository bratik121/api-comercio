import { Model } from 'mongoose';
import { OdmUserEntity } from '../../entities/odm-entities';
import { IOdmUserRepository } from 'src/user/domain/repositories';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { User } from 'src/user/domain/user';
import { Result } from 'src/common/abstractions/result';
import { UserIdVo, UserEmailVo } from 'src/user/domain/value-objects';
import { NotFoundUserException, SaveUserException } from '../../exceptions';
import { PersistenceException } from 'src/common/exceptions';

export class OdmUserRepository implements IOdmUserRepository {
  private readonly userModel: Model<OdmUserEntity>;
  private readonly userMapper: IMapper<User, OdmUserEntity>;
  constructor(
    userModel: Model<OdmUserEntity>,
    userMapper: IMapper<User, OdmUserEntity>,
  ) {
    this.userModel = userModel;
    this.userMapper = userMapper;
  }

  async findUserById(id: UserIdVo): Promise<Result<User>> {
    try {
      const user = await this.userModel.findById(id.getId()).exec();
      if (!user) {
        return Result.fail<User>(
          new NotFoundUserException(
            `Usuario con id ${id.getId()} no encontrado`,
          ),
        );
      }
      return Result.success<User>(this.userMapper.toDomain(user));
    } catch (error) {
      return Result.fail<User>(
        new PersistenceException(
          `Error al buscar el usuario por id: ${error.message}`,
        ),
      );
    }
  }
  async findUserByEmail(email: UserEmailVo): Promise<Result<User>> {
    try {
      const user = await this.userModel
        .findOne({ email: email.getEmail() })
        .exec();

      if (!user) {
        return Result.fail<User>(
          new NotFoundUserException(
            `Usuario con email ${email.getEmail()} no encontrado`,
          ),
        );
      }
      return Result.success<User>(this.userMapper.toDomain(user));
    } catch (error) {
      return Result.fail<User>(
        new PersistenceException(
          `Error al buscar el usuario por email: ${error.message}`,
        ),
      );
    }
  }
  async findAllUser(): Promise<Result<User[]>> {
    try {
      const users = await this.userModel.find().exec();
      return Result.success<User[]>(
        users.map((user) => this.userMapper.toDomain(user)),
      );
    } catch (error) {
      return Result.fail<User[]>(
        new PersistenceException(
          `Error al buscar todos los usuarios: ${error.message}`,
        ),
      );
    }
  }
  async saveUser(user: User): Promise<Result<User>> {
    try {
      const userEntity = this.userMapper.toPersistence(user);
      const savedUser = await this.userModel.create(userEntity);
      return Result.success<User>(this.userMapper.toDomain(savedUser));
    } catch (error) {
      return Result.fail<User>(
        new SaveUserException(`Error al guardar el usuario: ${error.message}`),
      );
    }
  }
}
