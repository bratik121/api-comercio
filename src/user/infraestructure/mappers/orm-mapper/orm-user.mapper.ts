import { User } from 'src/user/domain/user';
import { OrmUserEntity } from '../../entities/orm-entities/orm-user.entity';
import {
  UserEmailVo,
  UserIdVo,
  UserPasswordVo,
  UserNameVo,
} from 'src/user/domain/value-objects';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';

export class OrmUserMapper implements IMapper<User, OrmUserEntity> {
  toPersistence(domainEntity: User): OrmUserEntity {
    return OrmUserEntity.create(
      domainEntity.getId().getId(),
      domainEntity.getName().getName(),
      domainEntity.getEmail().getEmail(),
      domainEntity.getPassword().getPassword(),
    );
  }
  toDomain(infraEstructure: OrmUserEntity): User {
    return User.create(
      UserIdVo.create(infraEstructure.id),
      UserNameVo.create(infraEstructure.name),
      UserEmailVo.create(infraEstructure.email),
      UserPasswordVo.create(infraEstructure.password),
    );
  }
}
