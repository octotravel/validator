export class ErrorResponse {
  public constructor(
    public readonly error: string,
    public readonly errorMessage: string,
    public readonly data: unknown,
    public readonly stack?: string,
  ) {}
}
