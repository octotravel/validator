import "dotenv/config";
import Koa from 'koa';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import { router } from './router/router';

const app = new Koa();
const port = process.env.PORT ?? 3000;

app.use(koaBody());
app.use(cors());
app.use(router.routes());
app.listen({ port: port });