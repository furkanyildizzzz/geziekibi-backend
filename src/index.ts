import 'reflect-metadata';
import 'dotenv';

import fs from 'fs';
import path from 'path';

import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import './shared/response/customSuccess';
import { errorHandler } from 'middleware/errorHandler';
import { getLanguage } from 'middleware/getLanguage';
import { cloudinaryConfig } from 'config/cloudinaryConfig';
import { InversifyExpressServer } from 'inversify-express-utils';
import container from 'core/container';
import 'modules/contactForm/controller/ContactFormController';
import { initializeDatabase } from 'config/database';
import { authMiddleware } from 'middleware/authMiddleware';
import { userContextMiddleware } from 'middleware/userContextMiddleware';
import axios from 'axios';

const allowedOrigins = [
  'https://www.geziekibi-panel.com.tr',
  'https://geziekibi-test.vercel.app',
  'http://localhost:3000',
  'http://localhost:3004',
];

export const server = new InversifyExpressServer(container, null, { rootPath: '/v1' });

async function updateTrustedProxies(app) {
  try {
    const res = await axios.get('https://www.cloudflare.com/ips-v4');
    const cloudflareIps = res.data.split('\n').filter((ip) => ip.trim() !== '');

    app.set('trust proxy', ['loopback', ...cloudflareIps]);
    console.log('✅ Updated trusted proxies:', cloudflareIps);
  } catch (error) {
    console.error('❌ Failed to update Cloudflare IPs', error);
    app.set('trust proxy', 'loopback'); // Fallback to loopback
  }
}

server.setConfig(async (app) => {
  // if (process.env.NODE_ENV === 'production') {
  //   await updateTrustedProxies(app); // Dynamically update trusted proxies
  // } else {
  //   app.set('trust proxy', 0); // Don't trust any proxy in development
  // }

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('CORS hatası: Bu origin izinli değil!'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  );

  // 🔹 Preflight (OPTIONS) İsteğini Doğru Yapılandıralım:
  app.options('*', (req, res) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.sendStatus(204);
  });

  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser()); // Cookie'leri req.cookies içine parse eder
  app.use(getLanguage);
  app.use(authMiddleware);
  app.use(userContextMiddleware);

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
  initializeDatabase().then(() => {
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
  });
})();
