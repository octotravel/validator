import { RequestScopedContext } from './RequestScopedContext';
import { RuntimeError } from '@octocloud/core';
import { asyncLocalStorage } from '../di/asyncLocalStorage';

export class RequestScopedContextProvider {
  public getRequestScopedContext(): RequestScopedContext {
    const store = asyncLocalStorage.getStore();

    if (store === undefined) {
      throw new RuntimeError('AsyncLocalStorage is not available');
    }

    return store.requestScopedContext;
  }
}
