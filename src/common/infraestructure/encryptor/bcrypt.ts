import * as bcrypt from 'bcrypt';
import { IEncryptor } from 'src/common/aplication/encryptor/encryptor.interface';

export class BcryptEncryptor implements IEncryptor {
  hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  comparePassword(password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }
}
