import 'reflect-metadata';
import 'dotenv';

import fs from 'fs';
import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import './shared/response/customSuccess';
import { errorHandler } from 'middleware/errorHandler';
import { getLanguage } from 'middleware/getLanguage';
import { cloudinaryConfig } from 'config/cloudinaryConfig';
import { InversifyExpressServer } from 'inversify-express-utils';
import container from 'core/container';
import 'modules/contactForm/controller/ContactFormController';

export const server = new InversifyExpressServer(container, null, { rootPath: '/v1' });
server.setConfig((app) => {
  app.use(cors());

  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(getLanguage);
  cloudinaryConfig();

  try {
    const accessLogStream = fs.createWriteStream(path.join(__dirname, '../log/access.log'), {
      flags: 'a',
    });
    app.use(morgan('combined', { stream: accessLogStream }));
  } catch (err) {
    console.log(err);
  }
  app.use(morgan('combined'));
});

server.setErrorConfig((app) => {
  app.use(errorHandler);
});

(async () => {
  try {
    let app = server.build();
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database', err);
    process.exit(1); // Exit the process if the DB connection fails
  }
})();
