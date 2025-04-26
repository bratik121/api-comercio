import { IServiceResponse } from 'src/common/infraestructure/interfaces/IServices';

export class CreateUserReponse implements IServiceResponse {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
  ) {}
  dataToString(): string {
    return `User: "${this.name}"  "${this.email}" creado con id: ${this.id}`;
  }
}
