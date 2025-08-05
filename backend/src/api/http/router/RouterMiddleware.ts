import { Context, Next } from 'koa';
import { asyncLocalStorage } from '../../../common/di/asyncLocalStorage';
import { container } from '../../../common/di/container';
import { RequestScopedContext } from '../../../common/requestContext/RequestScopedContext';
import { ApiRouter } from '../../ApiRouter';

const apiRouter = container.get(ApiRouter);

export async function router(context: Context, next: Next): Promise<void> {
  const requestScopedContext = new RequestScopedContext();
  await asyncLocalStorage.run({ requestScopedContext }, async () => {
    await apiRouter.serve(context, next);
    await next();
  });
}
