import { Express } from 'express';
import helmet from 'helmet';

export const registerHelmet = (app: Express): void => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          // "unsafe-inline" is needed to serve SPA.
          defaultSrc: ["'self'", "'unsafe-inline'"],
          // "unsafe-inline" is needed to serve SPA.
          scriptSrc: ["'self'", "'unsafe-inline'"],
          // For socket.io
          connectSrc: ["'self'", process.env.NEXT_PUBLIC_BASE_SOCKET_URL],
          objectSrc: ["'none'"],
          imgSrc: [
            "'self'",
            // To upload images from browser
            'blob:',
            // For emojis
            'data: https://unpkg.com',
          ],
          upgradeInsecureRequests: [],
        },
      },
    }),
  );
};
