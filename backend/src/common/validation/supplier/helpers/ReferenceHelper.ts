export abstract class ReferenceHelper {
  public static generate = (): string => {
    const randomString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomResellerReference = Array.from({ length: 8 }, () =>
      randomString.charAt(Math.floor(Math.random() * randomString.length)),
    ).join('');
    return randomResellerReference;
  };
}
