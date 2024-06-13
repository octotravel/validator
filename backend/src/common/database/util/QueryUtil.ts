type MapToRowDataKeys<T> = {
  [K in keyof T as `row_${string & K}`]: T[K];
};

export class QueryUtil {
  public static getColumnNames(rowData: object): string {
    return Object.keys(rowData).join(', ');
  }

  public static getColumnBindNames(rowData: object): string {
    return Object.keys(rowData)
      .map((key) => `:${QueryUtil.convertCamelCaseToSnakeCase(key)}`)
      .join(', ');
  }

  private static convertCamelCaseToSnakeCase(camelCase: string): string {
    return camelCase.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
