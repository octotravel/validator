import * as yup from 'yup';

export class SchemaValidator {
  public static async validateSchema<T>(schema: yup.SchemaOf<T>, data: unknown): Promise<T> {
    await schema.validate(data);
    return schema.cast(data) as T;
  }
}
