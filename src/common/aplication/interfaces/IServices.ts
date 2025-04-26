import { Result } from 'src/common/abstractions/result';

export abstract class IService<
  I extends IServiceRequest,
  O extends IServiceResponse,
> {
  get name() {
    return this.constructor.name;
  }

  abstract execute(command: I): Promise<Result<O>>;
}

export interface IServiceRequest {
  dataToString(): string;
}

export interface IServiceResponse {
  dataToString(): string;
}
