import { IServiceRequest } from 'src/common/aplication/services/IServices';

export class RegisterRequest implements IServiceRequest {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {}

  dataToString(): string {
    return `Name: ${this.name}, Email: ${this.email}`;
  }
}
