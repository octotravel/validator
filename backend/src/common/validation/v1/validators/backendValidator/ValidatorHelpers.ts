import * as yup from 'yup';

interface BaseValidatorParams {
  shouldWarn?: boolean;
}

interface StringValidatorParams extends BaseValidatorParams {
  nullable?: boolean;
  equalsTo?: string;
}

export enum ErrorType {
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export interface MappedError {
  type: ErrorType;
  message: string;
}

export class ValidatorError extends Error {
  public type: ErrorType;
  public constructor({ message, type }: { message: string; type?: ErrorType }) {
    super(message);
    this.type = type ?? ErrorType.WARNING;
  }

  public mapError = (): MappedError => {
    return {
      type: this.type,
      message: this.message,
    };
  };
}

export interface ModelValidator {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  validate: (...args: any[]) => ValidatorError[];
}

class BaseValidator {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  protected static handleValidatedError = (error: any, shouldWarn = false): ValidatorError => {
    if (error instanceof yup.ValidationError) {
      if (error.type === 'required' || error.type === 'typeError') {
        return new ValidatorError({
          type: shouldWarn ? ErrorType.WARNING : ErrorType.CRITICAL,
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          message: error.errors as any,
        });
      }
    }

    return new ValidatorError({
      type: shouldWarn ? ErrorType.WARNING : ErrorType.CRITICAL,
      message: error.errors,
    });
  };
}

export class StringValidator extends BaseValidator {
  public static validate = (label: string, value: unknown, params?: StringValidatorParams): ValidatorError | null => {
    try {
      let schema: yup.BaseSchema<unknown>;

      if (params?.nullable) {
        schema = yup.string().label(label).nullable().defined();
      } else {
        schema = yup.string().label(label).required();
      }
      schema.validateSync(value, { strict: true });
      if (params?.equalsTo) {
        if (params.equalsTo !== value) {
          return new ValidatorError({
            type: ErrorType.WARNING,
            message: `${label} has to be equal to "${params.equalsTo}", but the provided value was: "${value}"`,
          });
        }
      }
      return null;
    } catch (err) {
      return this.handleValidatedError(err, params?.shouldWarn);
    }
  };
}

export class NullValidator extends BaseValidator {
  public static validate = (label: string, value: unknown): ValidatorError | null => {
    if (value !== null) {
      return new ValidatorError({
        type: ErrorType.WARNING,
        message: `${label} must be a \`null\` type, but the final value was: \`${value}\``,
      });
    }
    return null;
  };
}

interface NumberValidatorParams extends BaseValidatorParams {
  nullable?: boolean;
  integer?: boolean;
  equalsTo?: number;
  errorType?: ErrorType;
}

export class NumberValidator extends BaseValidator {
  public static validate = (label: string, value: unknown, params?: NumberValidatorParams): ValidatorError | null => {
    try {
      let schema = yup.number().label(label);
      if (params?.integer) {
        schema = schema.integer();
      }
      if (params?.nullable) {
        // @ts-expect-error: TODO fix
        schema = schema.nullable().defined();
      } else {
        schema = schema.required();
      }
      schema.validateSync(value, { strict: true });
      if (params?.equalsTo) {
        if (params.equalsTo !== value) {
          return new ValidatorError({
            type: params.errorType ?? ErrorType.WARNING,
            message: `${label} has to be equal to ${params.equalsTo}, but the provided value was: ${value}`,
          });
        }
      }
      return null;
    } catch (err) {
      return this.handleValidatedError(err, params?.shouldWarn);
    }
  };
}

interface BooleanValidatorParams extends BaseValidatorParams {
  equalsTo?: boolean;
  errorType?: ErrorType;
}

export class BooleanValidator extends BaseValidator {
  public static validate = (label: string, value: unknown, params?: BooleanValidatorParams): ValidatorError | null => {
    try {
      const schema = yup.boolean().label(label).required();
      schema.validateSync(value, { strict: true });
      if (params?.equalsTo) {
        if (params.equalsTo !== value) {
          return new ValidatorError({
            type: params.errorType ?? ErrorType.WARNING,
            message: `${label} has to be equal to ${params.equalsTo}, but the provided value was: ${value}`,
          });
        }
      }
      return null;
    } catch (err) {
      return this.handleValidatedError(err, params?.shouldWarn);
    }
  };
}

interface EnumValidatorParams extends BaseValidatorParams {
  nullable?: boolean;
  equalsTo?: boolean;
  errorType?: ErrorType;
}

export class EnumValidator extends BaseValidator {
  public static validate = (
    label: string,
    value: unknown,
    values: string[],
    params?: EnumValidatorParams,
  ): ValidatorError | null => {
    try {
      let schema: yup.BaseSchema<unknown>;

      if (params?.nullable) {
        schema = yup.mixed().label(label).nullable().defined();
      } else {
        schema = yup.mixed().label(label).oneOf(values).required();
      }
      schema.validateSync(value, { strict: true });
      if (params?.equalsTo) {
        if (params.equalsTo !== value) {
          return new ValidatorError({
            type: params.errorType ?? ErrorType.WARNING,
            message: `${label} has to be equal to ${params.equalsTo}, but the provided value was: ${value}`,
          });
        }
      }
      return null;
    } catch (err) {
      return this.handleValidatedError(err, params?.shouldWarn);
    }
  };
}

interface GeneralArrayValidatorParams extends BaseValidatorParams {
  min?: number;
  max?: number;
}

export class EnumArrayValidator extends BaseValidator {
  public static validate = (
    label: string,
    value: unknown,
    values: string[],
    params?: GeneralArrayValidatorParams,
  ): ValidatorError | null => {
    try {
      let schema = yup.array(yup.mixed().oneOf(values)).label(label).required();
      if (params?.min) {
        schema = schema.min(params.min);
      }
      if (params?.max) {
        schema = schema.max(params.max);
      }
      schema.validateSync(value, { strict: true });
      return null;
    } catch (err) {
      return this.handleValidatedError(err, params?.shouldWarn);
    }
  };
}

interface RegExpValidatorParams extends BaseValidatorParams {
  nullable?: boolean;
  isNull?: boolean;
}

export class RegExpValidator extends BaseValidator {
  public static validate = (
    label: string,
    value: unknown,
    regexp: RegExp,
    params?: RegExpValidatorParams,
  ): ValidatorError | null => {
    try {
      let schema: yup.BaseSchema<unknown>;

      if (params?.isNull) {
        schema = yup.string().label(label).nullable().defined();
      } else if (params?.nullable) {
        schema = yup.string().label(label).matches(regexp).nullable().defined();
      } else {
        schema = yup.string().label(label).matches(regexp).required();
      }

      schema.validateSync(value, { strict: true });
      return null;
    } catch (err) {
      return this.handleValidatedError(err, params?.shouldWarn);
    }
  };
}

export class RegExpArrayValidator extends BaseValidator {
  public static validate = (
    label: string,
    value: unknown,
    regexp: RegExp,
    params?: GeneralArrayValidatorParams,
  ): ValidatorError | null => {
    try {
      let schema = yup.array(yup.string().matches(regexp)).label(label).required();
      if (params?.min) {
        schema = schema.min(params.min);
      }
      if (params?.max) {
        schema = schema.max(params.max);
      }
      schema.validateSync(value, { strict: true });
      return null;
    } catch (e) {
      const err = e as Error;
      if (err instanceof yup.ValidationError) {
        if (err.path && err?.path.length > 1) {
          const errorMessage = `${label}${err.errors.join()}`;
          return new ValidatorError({
            type: ErrorType.WARNING,
            message: errorMessage,
          });
        }
      }

      return this.handleValidatedError(err, params?.shouldWarn);
    }
  };
}

interface ArrayValidatorParams extends GeneralArrayValidatorParams {
  empty?: boolean;
}

export class ArrayValidator extends BaseValidator {
  public static validate = (label: string, value: unknown, params?: ArrayValidatorParams): ValidatorError | null => {
    try {
      let schema = yup.array();
      if (params?.min) {
        schema = schema.min(params.min);
      }
      if (params?.max) {
        schema = schema.max(params.max);
      }
      schema = schema.label(label).required();
      schema.validateSync(value, { strict: true });
      if (params?.empty) {
        if (Array.isArray(value) && value.length !== 0) {
          return new ValidatorError({
            type: ErrorType.WARNING,
            message: `${label} must be an empty array, but it contains: \`${value.length}\` elements.`,
          });
        }
      }
      return null;
    } catch (err) {
      if (err instanceof ValidatorError) {
        return err;
      }
      return this.handleValidatedError(err, params?.shouldWarn);
    }
  };
}
export class StringArrayValidator extends BaseValidator {
  public static validate = (
    label: string,
    value: unknown,
    params?: GeneralArrayValidatorParams,
  ): ValidatorError | null => {
    try {
      let schema = yup.array(yup.string().required()).label(label).required();
      if (params?.min) {
        schema = schema.min(params.min);
      }
      if (params?.max) {
        schema = schema.max(params.max);
      }
      schema.validateSync(value, { strict: true });
      return null;
    } catch (err) {
      return this.handleValidatedError(err, params?.shouldWarn);
    }
  };
}

interface NumberArrayValidatorParams extends GeneralArrayValidatorParams {
  integer?: boolean;
}
export class NumberArrayValidator extends BaseValidator {
  public static validate = (
    label: string,
    value: unknown,
    params?: NumberArrayValidatorParams,
  ): ValidatorError | null => {
    try {
      let numberSchema = yup.number().required();
      if (params?.integer) {
        numberSchema = numberSchema.integer();
      }
      let schema = yup.array(numberSchema).label(label).required();
      if (params?.min) {
        schema = schema.min(params.min);
      }
      if (params?.max) {
        schema = schema.max(params.max);
      }
      schema.validateSync(value, { strict: true });
      return null;
    } catch (err) {
      return this.handleValidatedError(err, params?.shouldWarn);
    }
  };
}
