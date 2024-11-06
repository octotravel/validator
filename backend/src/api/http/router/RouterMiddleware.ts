import { Context, Next } from 'koa';
import { container } from '../../../common/di/container';
import { ApiRouter } from '../../ApiRouter';
import { asyncLocalStorage } from '../../../common/di/asyncLocalStorage';
import { RequestScopedContext } from '../../../common/requestContext/RequestScopedContext';

const apiRouter = container.get(ApiRouter);

export async function router(context: Context, next: Next): Promise<void> {
  const requestScopedContext = new RequestScopedContext();
  await asyncLocalStorage.run({ requestScopedContext }, async () => {
    await apiRouter.serve(context, next);
  });
}
