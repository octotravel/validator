export class ValidationFailure {
  private readonly message: string;
  private readonly data: unknown;

  public constructor(message: string, data: unknown) {
    this.message = message;
    this.data = data;
  }

  public getMessage(): string {
    return this.message;
  }

  public getData(): unknown {
    return this.data;
  }
}
