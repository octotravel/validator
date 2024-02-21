import * as yup from 'yup';
import { BAD_REQUEST, HttpBadRequest } from '@octocloud/core';

export class SchemaValidator {
  public static async validateSchema<T>(schema: yup.SchemaOf<T>, data: unknown): Promise<T> {
    try {
      await schema.validate(data);
      return schema.cast(data) as T;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        throw new HttpBadRequest({
          error: BAD_REQUEST,
          errorMessage: err.errors[0],
        });
      }
      throw err;
    }
  }
}
