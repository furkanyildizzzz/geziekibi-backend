import 'dotenv';
import 'reflect-metadata';

import fs from 'fs';
import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import './utils/response/customSuccess';
import { errorHandler } from 'middleware/errorHandler';
import { getLanguage } from 'middleware/getLanguage';
import { dbCreateConnection } from 'orm/dbCreateConnection';
import routes from './routes/';
import { cloudinaryConfig } from 'config/cloudinaryConfig';

// Load Google Drive credentials
// setAuthCredentials().catch(console.error);

export const app = express();
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

app.use('/', routes);

app.use(errorHandler);

(async () => {
  try {
    console.log('Database connection starting');

    // Call dbCreateConnection() and await its result
    await dbCreateConnection();

    console.log('Database connection established');

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database', err);
    process.exit(1); // Exit the process if the DB connection fails
  }
})();
