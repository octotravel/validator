export interface Command {
  getSlug: () => string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  run: (...args: any[]) => Promise<any>;
}
