import express, { Application } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import fs from 'fs';

import installValidator from './swagger';
import corsSwagger, { corsOptions } from './cors-opts';

const app = express();
const env = process.env.NODE_ENV || 'dev';

export default class ExpressServer {
  private routes: (application: Application) => void;
  constructor() {
    const root = path.normalize(__dirname + '/../');
    const publicDir = `${root}public`;

    app.use(cors(corsOptions));
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '2000mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '2000mb' }));
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '2000mb' }));
    app.use(cookieParser(process.env.SESSION_SECRET));

    // if (env === 'dev') {
      const devDir = path.normalize(__dirname + '/../..');

      app.use(corsSwagger);
      app.use(express.static(`${devDir}/public`));
    // } else {
    //   console.log('\nRoot directory: ', root, '\n');
    //   console.log('================');
    //   fs.readdirSync(root).forEach(file => {
    //     console.log(file);
    //   });

    //   console.log('================\n');

    //   console.log('Public directory: ', publicDir, '\n');
    //   console.log('================');
    //   fs.readdirSync(publicDir).forEach(file => {
    //     console.log(file);
    //   });
    //   console.log('================\n');

    //   app.use(express.static(publicDir));
    //   app.use(history());
    //   app.use(express.static(publicDir));

    //   app.get('/', (_req, res) => {
    //     res.sendFile(`${publicDir}/index.html`);
    //   });
    // }

    // if (['production', 'pre-production'].includes(env)) {
    //   app.use(express.static(`${root}/build/public`));
    //   app.use(history());
    //   app.use(express.static(`${root}/build/public`));

    //   app.get('/', (_req, res) => {
    //     res.sendFile(`${root}/build/public/index.html`);
    //   });
    // } else {
    //   app.use(express.static(`${root}/public`));
    // }
  }

  router(routes: (application: Application) => void): ExpressServer {
    this.routes = routes;
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void =>
      console.log(`Server is up and running in ${env} mode | @Host: ${os.hostname()} | on port: ${p}}`);

    installValidator(app, this.routes)
      .then(() => {
        http.createServer(app).listen(port, welcome(port));
      })
      .catch(err => {
        console.log('Starting server ERROR: ', err);
        process.exit(1);
      });

    return app;
  }
}
