import { ExeptionType } from './exception-type.enum';

export abstract class Exception extends Error {
  protected type: ExeptionType;
  constructor(msg: string) {
    super(msg);
    // Object.setPrototypeOf(this, Exception.prototype);
  }

  public getType(): ExeptionType {
    return this.type;
  }
}
