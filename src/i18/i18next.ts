// import i18next from 'i18next';

// i18next
//   .init({
//     resources: {
//       en: {
//         translation: {
//           bad_request: 'Bad Request',
//           not_found: 'Not Found',
//           primary_image_missing: 'Please provide a primary image',
//           parent_category_not_found: 'Parent Tour Category with id: {{id}} not found',
//         },
//       },
//       tr: {
//         translation: {
//           bad_request: 'Geçersiz İstek',
//           not_found: 'Bulunamadı',
//           primary_image_missing: 'Lütfen bir ana resim sağlayın, {{id}}',
//           parent_category_not_found: "ID'si {{id}} olan üst tur kategorisi bulunamadı",
//         },
//       },
//     },
//     fallbackLng: 'en',
//     interpolation: { escapeValue: false },
//   })
//   .then(() => {
//     console.log('i18next initialized');
//   });

// export default i18next;

import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import { InitOptions } from 'i18next';
import path from 'path';

// i18next yapılandırması
const i18nextConfig: InitOptions = {
  lng: 'en', // Varsayılan dil
  fallbackLng: 'en', // Yedek dil
  preload: ['en', 'tr'], // Yüklemek istediğimiz diller
  backend: {
    loadPath: path.join(__dirname, '/locales/{{lng}}/translation.json'), // Çevirilerin bulunduğu yol
  },
  interpolation: {
    escapeValue: false, // XSS saldırılarına karşı korunma
  },
};

i18next
  .use(Backend)
  .init(i18nextConfig)
  .then(() => {
    console.log('i18next initialized successfully');
  })
  .catch((error) => {
    console.error('i18next initialization failed:', error);
  });

export default i18next;
