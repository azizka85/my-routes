import { Translator } from '@azizka/i18n';

import enValues from '../../locales/en';
import ruValues from '../../locales/ru';
import kzValues from '../../locales/kz';

export default {
  en: Translator.create(enValues),
  ru: Translator.create(ruValues),
  kz: Translator.create(kzValues)
} as {
  [key: string]: Translator
};
