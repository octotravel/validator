export abstract class StringHelper {
  public static toInt(string: string): number {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) - hash + string.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
