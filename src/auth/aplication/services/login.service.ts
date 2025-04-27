import { IEncryptor } from 'src/common/aplication/encryptor/encryptor.interface';
import { IService } from 'src/common/aplication/services/IServices';
import { IOdmUserRepository } from 'src/user/domain/repositories';
import { AuthorizationResponse, LogInRequest } from '../dtos';
import { Result } from 'src/common/abstractions/result';
import { UserEmailVo } from 'src/user/domain/value-objects';
import { PasswordNotMatchException } from 'src/auth/domain/exceptions';
import { IJwtGen } from 'src/common/aplication/jwt-gen/jwt-gen.interface';

export class LoginService extends IService<
  LogInRequest,
  AuthorizationResponse
> {
  private readonly _odmUserRepository: IOdmUserRepository;

  private readonly encryptor: IEncryptor;
  private readonly jwtGen: IJwtGen<string>;

  constructor(
    odmUserRepository: IOdmUserRepository,
    encryptor: IEncryptor,
    jwtGen: IJwtGen<string>,
  ) {
    super();

    this._odmUserRepository = odmUserRepository;

    this.encryptor = encryptor;
    this.jwtGen = jwtGen;
  }

  async execute(command: LogInRequest): Promise<Result<AuthorizationResponse>> {
    const userResult = await this._odmUserRepository.findUserByEmail(
      UserEmailVo.create(command.email),
    );

    if (userResult.isFailure()) {
      throw userResult.getError();
    }

    const user = userResult.getValue();

    const passwordMatch = await this.encryptor.comparePassword(
      command.password,
      user.getPassword().getPassword(),
    );

    if (!passwordMatch) {
      throw new PasswordNotMatchException('La contraseña no coincide');
    }

    return Result.success<AuthorizationResponse>(
      new AuthorizationResponse(
        await this.jwtGen.genJwt(user.getId().getId()),
        user.getId().getId(),
        user.getName().getName(),
        user.getEmail().getEmail(),
      ),
    );
  }
}
