import { Result } from 'src/common/abstractions/result';
import { IServiceDecorator } from '../services/IServiceDecorator';
import { IServiceRequest, IServiceResponse } from '../services/IServices';
import { Exception } from 'src/common/exceptions/exception';
import { ExceptionMapper } from 'src/common/infraestructure/mappers/exception-mapper';

export class ExceptionDecorator<
  I extends IServiceRequest,
  O extends IServiceResponse,
> extends IServiceDecorator<I, O> {
  async execute(input: I): Promise<Result<O>> {
    try {
      const res = await this.decoratee.execute(input);
      // No es success
      if (!res.isSuccess()) {
        // Si el error es de dominio
        if (res.getError() instanceof Exception) {
          throw ExceptionMapper.toHttp(res.getError() as Exception);
        }
      }
      return res;
    } catch (error) {
      throw ExceptionMapper.toHttp(error as Exception);
    }
  }
}
