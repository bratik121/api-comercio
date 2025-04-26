import {
  UserEmailVo,
  UserIdVo,
  UserNameVo,
  UserPasswordVo,
} from 'src/user/domain/value-objects';
import { DuplicateUserException } from 'src/user/domain/exceptions';
import { User } from 'src/user/domain/user';
import { IJwtGen } from 'src/common/aplication/jwt-gen/jwt-gen.interface';
import { IService } from 'src/common/aplication/services/IServices';
import { AuthorizationResponse, RegisterRequest } from '../dtos';
import {
  IOdmUserRepository,
  IOrmUserRepository,
} from 'src/user/domain/repositories';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';
import { IEncryptor } from 'src/common/aplication/encryptor/encryptor.interface';
import { IIdGen } from 'src/common/aplication/id-gen/id-gen.interfaces';
import { Result } from 'src/common/abstractions/result';

export class RegisterService extends IService<
  RegisterRequest,
  AuthorizationResponse
> {
  private readonly _odmUserRepository: IOdmUserRepository;
  private readonly _ormUserRepository: IOrmUserRepository;
  private readonly eventPublisher: IEventPublisher;
  private readonly encryptor: IEncryptor;
  private readonly genId: IIdGen;
  private readonly jwtGen: IJwtGen<string>;

  constructor(
    odmUserRepository: IOdmUserRepository,
    ormUserRepository: IOrmUserRepository,
    eventPublisher: IEventPublisher,
    encryptor: IEncryptor,
    genId: IIdGen,
    jwtGen: IJwtGen<string>,
  ) {
    super();

    this._odmUserRepository = odmUserRepository;
    this._ormUserRepository = ormUserRepository;
    this.eventPublisher = eventPublisher;
    this.encryptor = encryptor;
    this.genId = genId;
    this.jwtGen = jwtGen;
  }

  async execute(
    command: RegisterRequest,
  ): Promise<Result<AuthorizationResponse>> {
    const duplicateUser = await this._odmUserRepository.findUserByEmail(
      UserEmailVo.create(command.email),
    );

    //verificamos si el user ya existe
    if (duplicateUser.isSuccess()) {
      throw new DuplicateUserException(`El usuario ${command.email} ya existe`);
    }

    const domainUser = User.create(
      UserIdVo.create(await this.genId.genId()),
      UserNameVo.create(command.name),
      UserEmailVo.create(command.email),
      UserPasswordVo.create(await this.encryptor.hash(command.password)),
    );

    const savedUserResult = await this._ormUserRepository.saveUser(domainUser);

    //verificamos si el user se guardo correctamente
    if (!savedUserResult.isSuccess()) {
      throw savedUserResult.getError();
    }

    const savedUser = savedUserResult.getValue();

    savedUser.Register();

    this.eventPublisher.publish(savedUser.pullDomainEvents());

    return Result.success<AuthorizationResponse>(
      new AuthorizationResponse(
        await this.jwtGen.genJwt(domainUser.getId().getId()),
        savedUser.getId().getId(),
        savedUser.getName().getName(),
        savedUser.getEmail().getEmail(),
      ),
    );
  }
}
