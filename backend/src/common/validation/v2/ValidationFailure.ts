import { ValidationFailureType } from './ValidationFailureType';

export class ValidationFailure {
  private readonly type: ValidationFailureType;
  private readonly path: string;
  private readonly message: string;
  private readonly data: unknown;

  public constructor(type: ValidationFailureType, path: string, message: string, data: unknown) {
    this.type = type;
    this.path = path;
    this.message = message;
    this.data = data;
  }

  public getType(): ValidationFailureType {
    return this.type;
  }

  public getPath(): string {
    return this.path;
  }

  public getMessage(): string {
    return this.message;
  }

  public getData(): unknown {
    return this.data;
  }

  public isError(): boolean {
    return this.type === ValidationFailureType.ERROR;
  }

  public isWarning(): boolean {
    return this.type === ValidationFailureType.WARNING;
  }
}
