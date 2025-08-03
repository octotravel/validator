import { StringHelper } from './StringHelper';

export class PseudoRandomGenerator {
  private seed: number;

  public constructor(seed: string | number) {
    this.seed = typeof seed === 'string' ? StringHelper.toInt(seed) : seed;
  }

  public next(): number {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;

    this.seed = (a * this.seed + c) % m;

    return this.seed / m;
  }

  public nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}
