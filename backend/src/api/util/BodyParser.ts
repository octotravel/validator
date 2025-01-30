import { BAD_REQUEST, HttpBadRequest } from '@octocloud/core';

export class BodyParser {
  public static async parseBody(request: Request): Promise<Record<string, unknown>> {
    try {
      const req = request.clone();
      const body = await req.json();
      return body;
    } catch (_) {
      throw new HttpBadRequest({
        error: BAD_REQUEST,
        errorMessage:
          'The request body is not formatted correctly, you have missing required fields or any of the data types are incorrect',
      });
    }
  }

  public static async parseBodyAsText(request: Request): Promise<string> {
    try {
      const req = request.clone();
      const body = await req.text();
      return body;
    } catch (_) {
      throw new HttpBadRequest({
        error: BAD_REQUEST,
        errorMessage:
          'The request body is not formatted correctly, you have missing required fields or any of the data types are incorrect',
      });
    }
  }
}
