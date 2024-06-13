import { AsyncLocalStorage } from 'async_hooks';
import { RequestScopedContext } from '../requestContext/RequestScopedContext';

export const asyncLocalStorage = new AsyncLocalStorage<{ requestScopedContext: RequestScopedContext }>();
