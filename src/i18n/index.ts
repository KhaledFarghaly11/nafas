import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import arCommon from '@/i18n/ar/common.json';
import enCommon from '@/i18n/en/common.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon },
    ar: { common: arCommon },
  },
  lng: 'ar',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
