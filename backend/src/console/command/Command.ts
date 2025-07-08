export interface Command {
  getSlug: () => string;
  // biome-ignore lint/suspicious/noExplicitAny: <?>
  run: (...args: any[]) => Promise<any>;
}
