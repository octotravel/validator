export abstract class ReferenceHelper {
    public static generate = (): string => {
        const randomResellerReference = Array.from({ length: 8 }, () =>
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 62)),
          ).join('');
        return randomResellerReference;
    }
}