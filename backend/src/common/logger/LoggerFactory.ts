import { Logger } from '@octocloud/core';

export interface LoggerFactory {
  create: (channelName?: string) => Logger;
}
