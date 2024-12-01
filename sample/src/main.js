import router from "./router/router.js";
import { useUserStore } from "@/stores/user.js";
import i18n from "@/i18n/lang.js";

import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .provide("user", useUserStore())
  .mount("#app");
