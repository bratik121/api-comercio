import { IIdGen } from 'src/common/aplication/id-gen/id-gen.interfaces';
import { v4 as uuidv4 } from 'uuid';

export class UuidGen implements IIdGen {
  async genId(): Promise<string> {
    return uuidv4();
  }
}
