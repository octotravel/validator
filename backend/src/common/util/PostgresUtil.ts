export class PostgresUtil {
  public static convertToPostgresArray(arr: string[]): string {
    return `{${arr.join(',')}}`;
  }

  public static convertToStringArray(postgresArray: string): string[] {
    if (postgresArray as unknown as string === '{}' || postgresArray === '') {
      return [];
    }

    const stripped = postgresArray.slice(1, -1);
    const elements = stripped.split(',');

    return elements.map((element) => element.trim());
  }
}
