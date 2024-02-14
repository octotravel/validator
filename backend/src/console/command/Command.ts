export interface Command {
  getSlug: () => string;
  run: (...args: any[]) => Promise<any>;
}
