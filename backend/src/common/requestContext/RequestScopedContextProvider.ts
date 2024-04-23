import { singleton } from 'tsyringe';
import { asyncLocalStorage } from '../../app';
import { RequestScopedContext } from './RequestScopedContext';
import { RuntimeError } from '@octocloud/core';

@singleton()
export class RequestScopedContextProvider {
  public getRequestScopedContext(): RequestScopedContext {
    const store = asyncLocalStorage.getStore();

    if (store === undefined) {
      throw new RuntimeError('AsyncLocalStorage is not available');
    }

    return store.requestScopedContext;
  }
}
