import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthorizationResponse, LogInRequest } from 'src/auth/aplication/dtos';
import { IEncryptor } from 'src/common/aplication/encryptor/encryptor.interface';
import { IIdGen } from 'src/common/aplication/id-gen/id-gen.interfaces';
import { IJwtGen } from 'src/common/aplication/jwt-gen/jwt-gen.interface';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { IService } from 'src/common/aplication/services/IServices';
import { BcryptEncryptor } from 'src/common/infraestructure/encryptor/bcrypt';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { IOdmUserRepository } from 'src/user/domain/repositories';
import { User } from 'src/user/domain/user';
import { OdmUserEntity } from 'src/user/infraestructure/entities/odm-entities';
import { OdmUserMapper } from 'src/user/infraestructure/mappers/odm-mapper/odm-user.mapper';
import { JwtGen } from '../jwt-gen/jwt-gen';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OdmUserRepository } from 'src/user/infraestructure/repositories/odm-repositories/odm-user.repository';
import { ExceptionDecorator } from 'src/common/aplication/aspects/exceptionDecorator';
import { LoginService } from 'src/auth/aplication/services';
import { LoginDto } from '../dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly genId: IIdGen = new UuidGen();
  private readonly jwtGen: IJwtGen<string>;
  //? Encripter
  private readonly encryptor: IEncryptor = new BcryptEncryptor();

  //?Mappers
  private readonly _odmUserMapper: IMapper<User, OdmUserEntity> =
    new OdmUserMapper();

  //?Repositories
  private readonly _odmUserRepository: IOdmUserRepository;

  //?Services
  private loginService: IService<LogInRequest, AuthorizationResponse>;

  constructor(
    private jwtService: JwtService,
    @InjectModel('user') userModel: Model<OdmUserEntity>,
  ) {
    this.jwtGen = new JwtGen(jwtService);

    //* Repositories
    this._odmUserRepository = new OdmUserRepository(
      userModel,
      this._odmUserMapper,
    );
    //*Services
    this.loginService = new ExceptionDecorator(
      new LoginService(this._odmUserRepository, this.encryptor, this.jwtGen),
    );
  }

  @Post('login')
  @ApiCreatedResponse({ description: 'Loged in succesfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async login(@Body() body: LoginDto) {
    const request = new LogInRequest(body.email, body.password);
    const response = await this.loginService.execute(request);

    if (response.isSuccess()) {
      return response.getValue();
    }

    return response;
  }
}
