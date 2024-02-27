export class JsonResponseFactory {
  public readonly S200_OK = 200;
  public readonly S204_NO_CONTENT = 204;
  public readonly S400_BAD_REQUEST = 400;

  public create(data: unknown, httpStatus: number = this.S200_OK): Response {
    return new Response(JSON.stringify(data), {
      headers: { 'content-type': 'application/json' },
      status: httpStatus,
    });
  }

  public createEmpty(httpStatus: number = this.S204_NO_CONTENT): Response {
    return new Response(null, {
      headers: { 'content-type': 'application/json' },
      status: httpStatus,
    });
  }
}
