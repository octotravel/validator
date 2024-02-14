import Koa from 'koa';
import koaBody from 'koa-body';

const customContentTypes = ['application/vnd.localexpert.v2.3+json'];

export async function bodyParserMiddleware(context: Koa.Context, next: Koa.Next): Promise<void> {
  const contentType = context.request.headers['content-type'] ?? '';
  const onlyContentType = contentType.split(';')[0];

  if (customContentTypes.includes(onlyContentType)) {
    context.originalContentType = contentType;
    context.request.headers['content-type'] = 'application/json';
  }

  await koaBody()(context, async () => {
    try {
      if (context.originalContentType) {
        context.request.headers['content-type'] = context.originalContentType;
      }

      await next();
    } catch (err: any) {
      context.app.emit('error', err, context);
    }
  });
}
