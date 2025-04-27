import { IServiceRequest } from 'src/common/aplication/services/IServices';

export class CreateUserRequest implements IServiceRequest {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
  dataToString(): string {
    return `name: ${this.name}, email: ${this.email}`;
  }
}
