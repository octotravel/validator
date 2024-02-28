export class ValidationFailure {
  private readonly path: string;
  private readonly message: string;
  private readonly data: unknown;

  public constructor(path: string, message: string, data: unknown) {
    this.path = path;
    this.message = message;
    this.data = data;
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
}
