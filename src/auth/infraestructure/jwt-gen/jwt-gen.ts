import { JwtService } from '@nestjs/jwt';
import { Result } from 'src/common/abstractions/result';
import { IJwtGen } from 'src/common/aplication/jwt-gen/jwt-gen.interface';
import { UnauthorizedException } from 'src/common/exceptions/unauthorized.exception';

export class JwtGen implements IJwtGen<string> {
  private jwtService: JwtService;

  constructor(jwtService: JwtService) {
    this.jwtService = jwtService;
  }

  async genJwt(id: string): Promise<string> {
    return this.jwtService.signAsync({ id });
  }

  async verifyJwt(token: string): Promise<Result<string>> {
    try {
      const { id } = this.jwtService.verify(token) as { id: string };
      return Result.success(id);
    } catch (error) {
      return Result.fail<string>(
        new UnauthorizedException(
          `Token provided is not valid: ${error.message}`,
        ),
      );
    }
  }
}
