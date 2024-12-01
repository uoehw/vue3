import { createI18n } from "vue-i18n";
import langEn from "./lang.en";
import langFr from "./lang.fr";
import langJa from "./lang.ja";

const i18n = createI18n({
  locale: "kh",
  fallbackLocale: "en",
  messages: {
    en: langEn,
    fr: langFr,
    ja: langJa,
  },
});

export default i18n;
