import { Environment } from '@octocloud/core';
import tracer from 'dd-trace';
import config from '../config/config';

const env = config.getEnvironment();

export const ddTracer =
  env !== Environment.LOCAL && env !== Environment.TEST ? tracer.init({ logInjection: true }) : null;
