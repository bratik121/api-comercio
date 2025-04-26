export class Result<T> {
  private value: T | null;
  private error: Error | null;

  private constructor(value: T | null, error: Error | null) {
    this.value = value;
    this.error = error;
  }

  public getValue(): T {
    if (!this.value) {
      throw new Error('Result no tiene un valor');
    }
    return this.value;
  }

  public getError(): Error {
    if (!this.error) {
      throw new Error('Result no tiene un error');
    }
    return this.error;
  }

  public isSuccess(): boolean {
    return !this.error;
  }

  public isFailure(): boolean {
    return !!this.error;
  }

  static success<T>(value: T): Result<T> {
    return new Result<T>(value, null);
  }

  static fail<T>(error: Error) {
    return new Result<T>(null, error);
  }
}
