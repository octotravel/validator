export class ErrorResponse {
  public constructor(
    public readonly error: string,
    public readonly errorMessage: string,
    public readonly data: any,
    public readonly stack?: string,
  ) {}
}
