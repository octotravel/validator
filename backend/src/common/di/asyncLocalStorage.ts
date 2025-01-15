import { AsyncLocalStorage } from 'node:async_hooks';
import { RequestScopedContext } from '../requestContext/RequestScopedContext';

export const asyncLocalStorage = new AsyncLocalStorage<{ requestScopedContext: RequestScopedContext }>();
