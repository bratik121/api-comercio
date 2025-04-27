import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IIdGen } from 'src/common/aplication/id-gen/id-gen.interfaces';
import { IMapper } from 'src/common/aplication/mappers/mapper.interface';
import { UuidGen } from 'src/common/infraestructure/id-gen/uuid-gen';
import { User } from 'src/user/domain/user';
import { OdmUserEntity } from '../entities/odm-entities';
import { OdmUserMapper } from '../mappers/odm-mapper/odm-user.mapper';
import { OrmUserMapper } from '../mappers/orm-mapper/orm-user.mapper';
import { OrmUserEntity } from '../entities/orm-entities';
import { InjectEntityManager } from '@nestjs/typeorm';

import {
  IOdmUserRepository,
  IOrmUserRepository,
} from 'src/user/domain/repositories';
import { IService } from 'src/common/aplication/services/IServices';
import { CreateUserReponse, CreateUserRequest } from 'src/user/aplication/dtos';
import { IEncryptor } from 'src/common/aplication/encryptor/encryptor.interface';
import { BcryptEncryptor } from 'src/common/infraestructure/encryptor/bcrypt';
import { IEventPublisher } from 'src/common/aplication/events/event-publisher.interfaces';
import { IEventSubscriber } from 'src/common/aplication/events/event-suscriber.interface';
import { UserRegisteredEvent } from 'src/user/domain/events';
import { EntityManager } from 'typeorm';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OdmUserRepository } from '../repositories/odm-repositories/odm-user.repository';
import { OrmUserRepository } from '../repositories/orm-repositories/orm-user.repository';
import { OdmSaveUserEvent } from '../events';
import { CreateUserService } from 'src/user/aplication/services';
import { RegisteredUserMapper } from '../mappers/domain-event-mapper';
import { RabbitMQEventPublisher } from 'src/common/infraestructure/events/publishers/rabbittMq.publisher';
import { CreateUserDto } from '../dtos';
import { Channel } from 'amqplib';
import { ExceptionDecorator } from 'src/common/aplication/aspects/exceptionDecorator';
import { JwtAuthGuard } from 'src/auth/infraestructure/guards/jwt-guard.guard';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  //?Id generator
  private readonly genId: IIdGen = new UuidGen();
  //? Encripter
  private readonly encryptor: IEncryptor = new BcryptEncryptor();
  //? Publisher
  private readonly _eventPublisher: IEventPublisher;

  //?Mappers
  private readonly _odmUserMapper: IMapper<User, OdmUserEntity> =
    new OdmUserMapper();
  private readonly _ormUserMapper: IMapper<User, OrmUserEntity> =
    new OrmUserMapper();

  //?Repositories
  private readonly _odmUserRepository: IOdmUserRepository;
  private readonly _ormUserRepository: IOrmUserRepository;

  //?Services
  private createUserService: IService<CreateUserRequest, CreateUserReponse>;

  //?Events
  private readonly _saveUserEvent: IEventSubscriber<UserRegisteredEvent>;

  constructor(
    @Inject('RABBITMQ_CONNECTION') private readonly channel: Channel,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectModel('user') userModel: Model<OdmUserEntity>,
  ) {
    //*Publisher
    this._eventPublisher = new RabbitMQEventPublisher(channel);

    //* Repositories
    this._odmUserRepository = new OdmUserRepository(
      userModel,
      this._odmUserMapper,
    );
    this._ormUserRepository = new OrmUserRepository(
      this.entityManager,
      this._ormUserMapper,
    );

    //*Services
    this.createUserService = new ExceptionDecorator(
      new CreateUserService(
        this._odmUserRepository,
        this._ormUserRepository,
        this._eventPublisher,
        this.encryptor,
        this.genId,
      ),
    );

    //*Events
    this._saveUserEvent = new OdmSaveUserEvent(this._odmUserRepository);

    //* Suscribe to events
    this._eventPublisher.subscribe(
      UserRegisteredEvent.name,
      [this._saveUserEvent],
      RegisteredUserMapper,
    );
  }

  @Post('create')
  @ApiCreatedResponse({ description: 'User created succesfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Conflict' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async createUser(@Body() body: CreateUserDto) {
    const request = new CreateUserRequest(body.name, body.email, body.password);

    const response = await this.createUserService.execute(request);
    if (response.isSuccess()) {
      return response.getValue().dataToString();
    }
    return response;
  }
}
