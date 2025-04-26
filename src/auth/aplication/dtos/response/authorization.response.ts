import { IServiceResponse } from 'src/common/aplication/services/IServices';

export class AuthorizationResponse implements IServiceResponse {
  constructor(
    private readonly token: string,
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
  ) {}

  dataToString(): string {
    return `Usuario de id: ${this.id}, name: ${this.name}, email: ${this.email} autenticado`;
  }

  getId(): string {
    return this.id;
  }
}
