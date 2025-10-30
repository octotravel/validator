import { Logger, SubRequestContext } from '@octocloud/core';

export interface ConsoleLogger extends Logger {
  logRequest(subRequestContext: SubRequestContext): Promise<void>;
  logResponse(subRequestContext: SubRequestContext): Promise<void>;
}
