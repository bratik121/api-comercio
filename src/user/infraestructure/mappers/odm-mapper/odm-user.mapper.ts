import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { OdmUserEntity } from '../../entities/odm-entities/odm-user.entity';
import { User } from 'src/user/domain/user';
import {
  UserEmailVo,
  UserIdVo,
  UserPasswordVo,
  UserNameVo,
} from 'src/user/domain/value-objects';

export class OdmUserMapper implements IMapper<User, OdmUserEntity> {
  toDomain(infraEstructure: OdmUserEntity): User {
    return User.create(
      UserIdVo.create(infraEstructure.id),
      UserNameVo.create(infraEstructure.name),
      UserEmailVo.create(infraEstructure.email),
      UserPasswordVo.create(infraEstructure.password),
    );
  }
  toPersistence(domainEntity: User): OdmUserEntity {
    return OdmUserEntity.create(
      domainEntity.getId().getId(),
      domainEntity.getName().getName(),
      domainEntity.getEmail().getEmail(),
      domainEntity.getPassword().getPassword(),
    );
  }
}
