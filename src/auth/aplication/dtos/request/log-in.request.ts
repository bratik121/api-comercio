import { IServiceRequest } from 'src/common/aplication/services/IServices';

export class LogInRequest implements IServiceRequest {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}

  dataToString(): string {
    return `Email: ${this.email}`;
  }
}
