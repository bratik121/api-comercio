import { Result } from 'src/common/abstractions/result';
import { IService, IServiceRequest, IServiceResponse } from './IServices';

export abstract class IServiceDecorator<
  I extends IServiceRequest,
  O extends IServiceResponse,
> implements IService<I, O>
{
  protected readonly decoratee: IService<I, O>;

  constructor(decoratee: IService<I, O>) {
    this.decoratee = decoratee;
  }

  get name() {
    return this.decoratee.name;
  }
  abstract execute(input: I): Promise<Result<O>>;
}
