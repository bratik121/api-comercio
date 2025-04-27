import { Body, Controller, Inject, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthorizationResponse,
  LogInRequest,
  RegisterRequest,
} from 'src/auth/aplication/dtos';
import { IEncryptor } from 'src/common/aplication/encryptor/encryptor.interface';
import { IIdGen } from 'src/common/aplication/id-gen/id-gen.interfaces';
import { IJwtGen } from 'src/common/aplication/jwt-gen/jwt-gen.interface';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { IService } from 'src/common/aplication/services/IServices';
import { BcryptEncryptor } from 'src/common/infraestructure/encryptor/bcrypt';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import {
  IOdmUserRepository,
  IOrmUserRepository,
} from 'src/user/domain/repositories';
import { User } from 'src/user/domain/user';
import { OdmUserEntity } from 'src/user/infraestructure/entities/odm-entities';
import { OdmUserMapper } from 'src/user/infraestructure/mappers/odm-mapper/odm-user.mapper';
import { JwtGen } from '../jwt-gen/jwt-gen';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OdmUserRepository } from 'src/user/infraestructure/repositories/odm-repositories/odm-user.repository';
import { ExceptionDecorator } from 'src/common/aplication/aspects/exceptionDecorator';
import { LoginService, RegisterService } from 'src/auth/aplication/services';
import { LoginDto, RegisterDto } from '../dtos';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';
import { Channel } from 'amqplib';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { RabbitMQEventPublisher } from 'src/common/infraestructure/events/publishers/rabbittMq.publisher';
import { OrmUserRepository } from 'src/user/infraestructure/repositories/orm-repositories/orm-user.repository';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly genId: IIdGen = new UuidGen();
  private readonly jwtGen: IJwtGen<string>;
  //? Encripter
  private readonly encryptor: IEncryptor = new BcryptEncryptor();
  //? Publisher
  private readonly _eventPublisher: IEventPublisher;

  //?Mappers
  private readonly _odmUserMapper: IMapper<User, OdmUserEntity> =
    new OdmUserMapper();
  private readonly _ormUserMapper: IMapper<User, OdmUserEntity> =
    new OdmUserMapper();

  //?Repositories
  private readonly _odmUserRepository: IOdmUserRepository;
  private readonly _ormUserRepository: IOrmUserRepository;

  //?Services
  private loginService: IService<LogInRequest, AuthorizationResponse>;
  private registerService: IService<RegisterRequest, AuthorizationResponse>;

  constructor(
    private jwtService: JwtService,
    @Inject('RABBITMQ_CONNECTION') private readonly channel: Channel,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectModel('user') userModel: Model<OdmUserEntity>,
  ) {
    this.jwtGen = new JwtGen(jwtService);

    //*Publisher
    this._eventPublisher = new RabbitMQEventPublisher(channel);

    //* Repositories
    this._odmUserRepository = new OdmUserRepository(
      userModel,
      this._odmUserMapper,
    );

    this._ormUserRepository = new OrmUserRepository(
      entityManager,
      this._odmUserMapper,
    );

    //*Services
    this.loginService = new ExceptionDecorator(
      new LoginService(this._odmUserRepository, this.encryptor, this.jwtGen),
    );

    this.registerService = new ExceptionDecorator(
      new RegisterService(
        this._odmUserRepository,
        this._ormUserRepository,
        this._eventPublisher,
        this.encryptor,
        this.genId,
        this.jwtGen,
      ),
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

  @Post('register')
  @ApiCreatedResponse({ description: 'User created succesfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async register(@Body() body: RegisterDto) {
    const request = new RegisterRequest(body.name, body.email, body.password);
    const response = await this.registerService.execute(request);

    if (response.isSuccess()) {
      return response.getValue();
    }

    return response;
  }
}
