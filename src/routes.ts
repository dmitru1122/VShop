import { Application } from 'express';
import pingRouter from './api/controllers/ping-sf/router';
import formsRouter from './api/controllers/forms/router';
import emailRouter from './api/controllers/sending-email/router';
import productRouter from './api/controllers/product/router';

const mainRoute = '/api/v1';

export default function routes(app: Application): void {
  app.use(`${mainRoute}/ping-sf`, pingRouter);
  app.use(`${mainRoute}/send-email`, emailRouter);
  app.use(`${mainRoute}/product`, productRouter);
}
