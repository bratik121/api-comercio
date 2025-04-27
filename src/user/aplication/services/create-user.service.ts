import {
  UserEmailVo,
  UserIdVo,
  UserNameVo,
  UserPasswordVo,
} from 'src/user/domain/value-objects';
import { DuplicateUserException } from 'src/user/domain/exceptions';
import { User } from 'src/user/domain/user';
import { IService } from 'src/common/aplication/services/IServices';
import { CreateUserReponse, CreateUserRequest } from '../dtos';
import {
  IOdmUserRepository,
  IOrmUserRepository,
} from 'src/user/domain/repositories';
import { IIdGen } from 'src/common/aplication/id-gen/id-gen.interfaces';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';
import { IEncryptor } from 'src/common/aplication/encryptor/encryptor.interface';
import { Result } from 'src/common/abstractions/result';

export class CreateUserService extends IService<
  CreateUserRequest,
  CreateUserReponse
> {
  private readonly _odmUserRepository: IOdmUserRepository;
  private readonly _ormUserRepository: IOrmUserRepository;
  private readonly eventPublisher: IEventPublisher;
  private readonly encryptor: IEncryptor;
  private readonly genId: IIdGen;

  constructor(
    odmUserRepository: IOdmUserRepository,
    ormUserRepository: IOrmUserRepository,
    eventPublisher: IEventPublisher,
    encryptor: IEncryptor,
    genId: IIdGen,
  ) {
    super();
    this._odmUserRepository = odmUserRepository;
    this._ormUserRepository = ormUserRepository;
    this.eventPublisher = eventPublisher;
    this.encryptor = encryptor;
    this.genId = genId;
  }

  async execute(
    command: CreateUserRequest,
  ): Promise<Result<CreateUserReponse>> {
    const duplicateUser = await this._odmUserRepository.findUserByEmail(
      UserEmailVo.create(command.email),
    );

    //verificamos si el user ya existe
    if (duplicateUser.isSuccess()) {
      throw new DuplicateUserException(`El Usuario ${command.email} ya existe`);
    }

    const domainUser = User.create(
      UserIdVo.create(await this.genId.genId()),
      UserNameVo.create(command.name),
      UserEmailVo.create(command.email),
      UserPasswordVo.create(await this.encryptor.hash(command.password)),
    );

    //Guardo el usuario en la base de datos
    const savedUserResult = await this._ormUserRepository.saveUser(domainUser);

    if (savedUserResult.isSuccess()) {
      const savedUser = savedUserResult.getValue();
      savedUser.Register();
      // Publico el evento de usuario registrado
      this.eventPublisher.publish(savedUser.pullDomainEvents());
      return Result.success<CreateUserReponse>(
        new CreateUserReponse(
          savedUser.getName().getName(),
          savedUser.getId().getId(),
          savedUser.getEmail().getEmail(),
        ),
      );
    }

    return Result.fail<CreateUserReponse>(savedUserResult.getError());
  }
}
