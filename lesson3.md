# Theming

Uncomment the css variable under the `:root` in `src/assets/main.css` file then replace `#TBD` value color with below values

```css
--sample-primary-light-color-1: #b5c18e;
--sample-primary-light-color-2: #eadbc8;
--sample-secondary-light-color-1: #c7b7a3;
--sample-secondary-light-color-2: #f1f1f1;
```

Also add a new stylesheet below to `src/assets/main.css` file.

```css
body.light-theme {
    --sample-primary-color-1: var(--sample-primary-light-color-1);
    --sample-primary-color-2: var(--sample-primary-light-color-2);
    --sample-secondary-color-1: var(--sample-secondary-light-color-1);
    --sample-secondary-color-2: var(--sample-secondary-light-color-2);
}
```

## Create a component to which the theme

```shell
touch src/components/ThemeSwitch.vue
```

Add below code to `src/components/ThemeSwitch.vue`

```html
<script setup>
import { ref, watch } from "vue";

// the default theme is dark themes
const isLightTheme = ref(localStorage.getItem("theme") || false);

watch(isLightTheme, async function (newValue, oldValue) {
    localStorage.setItem("theme", newValue);
    document.body.classList.toggle("light-theme");
});
</script>

<template>
    <div class="pinned">
        <input class="toggle" v-model="isLightTheme" type="checkbox" />
    </div>
</template>

<style scoped>
.pinned {
    position: absolute;
    top: 8px;
    right: 8px;
}

.toggle {
    appearance: none;
    position: relative;
    display: inline-block;
    box-sizing: content-box;
    width: 4.5em;
    height: 2em;
    padding: 0.1em;
    border: none;
    cursor: pointer;
    border-radius: 1.5em;
    overflow: hidden;
    background-color: #1b2026;
    transition: background ease 0.3s;
}

.toggle:before {
    content: "☀️ 🌙";
    display: block;
    position: absolute;
    z-index: 2;
    width: 2em;
    height: 2em;
    font-family: system-ui;
    font-size: 1em;
    line-height: 2em;
    font-weight: 500;
    text-transform: uppercase;
    text-indent: -2em;
    word-spacing: 3.2em;
    text-shadow: -1px -1px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
    background: #fff;
    color: #fff;
    border-radius: 1.5em;
    transition: transform cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
}

.toggle:checked {
    background-color: #7f9996;
}

.toggle:checked:before {
    transform: translateX(2.5em);
}
</style>
```

Import `ThemeSwitch` into `src/views/HomeView.vue` file or any other view file that you which have ability to switch between
light and dark theme.

```html
<script setup>
// .... existing script ....
import ThemeSwitch from "@/components/ThemeSwitch.vue";

// .... existing script ....
</script>

<template>
    <AppBackground />
    <ThemeSwitch />

<!-- existing code -->
```

Update the `src/App.vue` with the following code below.

```html
<script setup>
// .... existing import script ....
import { onMounted } from "vue";

onMounted(() => {
  // localStorage convert all type to string therefore we need to convert it back when retrieve it
  const val = localStorage.getItem("theme") === "true";
  if (val) {
      document.body.classList.toggle("light-theme");
  }
});
</script>

<!-- existing code -->
```

# Localization

Install i18n library and create localization file. More information visit [Vue i18n](https://vue-i18n.intlify.dev/).

```shell
npm install vue-i18n@10
mkdir -p src/i18n && touch src/i18n/lang.en.js src/i18n/lang.fr.js src/i18n/lang.ja.js src/i18n/lang.js
```

Replace content below to it respective file

```javascript
// src/i18n/lang.en.js
export default {
  welcome: "Welcome to Chit & Chat",
  slogan: "Where Hospitality Meets Home",
  btn_login: "Login",
  btn_create_enter: "Create & Enter",
};

// src/i18n/lang.fr.js
export default {
  welcome: "Bienvenue sur Chit & Chat",
  slogan: "Là où l'hospitalité rencontre la maison",
  btn_login: "Se connecter",
  btn_create_enter: "Créer et Entrer",
};

// src/i18n/lang.ja.js
export default {
  welcome: "チット＆チャットへようこそ",
  slogan: "おもてなしと家庭が出会う場所",
  btn_login: "ログイン",
  btn_create_enter: "作成して入力",
};

// src/i18n/lang.js
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
```

Import our recent created vue-i18n defined in `src/i18n/lang.js` file in `src/main.js`

```javascript
import i18n from "@/i18n/lang.js";

// add i18n to Vue app instance
createApp(App)
  .use(i18n)
// .... existing script ....
```

Replace content in `src/views/HomeView.vue` follow the instruction below.

```javascript
// change text below to i18n translation binding below
"Welcome to Chit & Chat"
"Where Hospitality Meets Home"
"Enter Our Home"
"forgot password?"
"Login"
'Create & Enter'

// i18n binding
{{ $t("welcome") }}
{{ $t("slogan") }}
{{ $t('login_banner') }}
{{ $t("forgot_password") }}
{{ $t("btn_login") }}
{{ $t("btn_create_enter") }}
```

Update `src/router/router.js` file with following instruction

1. Import `i18n` from `src/i18n/lang.js`

```javascript
import i18n from "@/i18n/lang";
```

2. If you've not handle route guard with `route.beforeEach` function yet, then add one other moving to next step

```javascript
router.beforeEach((to, from) = {});
```

3. Insert below code into anonymous function of `beforeEach`

```javascript
router.beforeEach((to, from) = {
  // .... existing code if any ....

// redirect to default language english
if (to.query.lang === undefined) {
  if (from.query.lang === undefined) {
    to.query.lang = "en";
  } else {
    to.query.lang = from.query.lang;
  }
  return to;
}

// guard by above code
i18n.global.locale = to.query.lang;

  // .... existing code if any ....
});
```
# Theming

Uncomment the css variable under the `:root` in `src/assets/main.css` file then replace `#TBD` value color with below values

```css
--sample-primary-light-color-1: #b5c18e;
--sample-primary-light-color-2: #eadbc8;
--sample-secondary-light-color-1: #c7b7a3;
--sample-secondary-light-color-2: #f1f1f1;
```

Also add a new stylesheet below to `src/assets/main.css` file.

```css
body.light-theme {
    --sample-primary-color-1: var(--sample-primary-light-color-1);
    --sample-primary-color-2: var(--sample-primary-light-color-2);
    --sample-secondary-color-1: var(--sample-secondary-light-color-1);
    --sample-secondary-color-2: var(--sample-secondary-light-color-2);
}
```

## Create a component to which the theme

```shell
touch src/components/ThemeSwitch.vue
```

Add below code to `src/components/ThemeSwitch.vue`

```html
<script setup>
import { ref, watch } from "vue";

// the default theme is dark themes
const isLightTheme = ref(localStorage.getItem("theme") || false);

watch(isLightTheme, async function (newValue, oldValue) {
    localStorage.setItem("theme", newValue);
    document.body.classList.toggle("light-theme");
});
</script>

<template>
    <div class="pinned">
        <input class="toggle" v-model="isLightTheme" type="checkbox" />
    </div>
</template>

<style scoped>
.pinned {
    position: absolute;
    top: 8px;
    right: 8px;
}

.toggle {
    appearance: none;
    position: relative;
    display: inline-block;
    box-sizing: content-box;
    width: 4.5em;
    height: 2em;
    padding: 0.1em;
    border: none;
    cursor: pointer;
    border-radius: 1.5em;
    overflow: hidden;
    background-color: #1b2026;
    transition: background ease 0.3s;
}

.toggle:before {
    content: "☀️ 🌙";
    display: block;
    position: absolute;
    z-index: 2;
    width: 2em;
    height: 2em;
    font-family: system-ui;
    font-size: 1em;
    line-height: 2em;
    font-weight: 500;
    text-transform: uppercase;
    text-indent: -2em;
    word-spacing: 3.2em;
    text-shadow: -1px -1px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
    background: #fff;
    color: #fff;
    border-radius: 1.5em;
    transition: transform cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
}

.toggle:checked {
    background-color: #7f9996;
}

.toggle:checked:before {
    transform: translateX(2.5em);
}
</style>
```

Import `ThemeSwitch` into `src/views/HomeView.vue` file or any other view file that you which have ability to switch between
light and dark theme.

```html
<script setup>
// .... existing script ....
import ThemeSwitch from "@/components/ThemeSwitch.vue";

// .... existing script ....
</script>

<template>
    <AppBackground />
    <ThemeSwitch />

<!-- existing code -->
```

Update the `src/App.vue` with the following code below.

```html
<script setup>
// .... existing import script ....
import { onMounted } from "vue";

onMounted(() => {
  // localStorage convert all type to string therefore we need to convert it back when retrieve it
  const val = localStorage.getItem("theme") === "true";
  if (val) {
      document.body.classList.toggle("light-theme");
  }
});
</script>

<!-- existing code -->
```

# Localization

Install i18n library and create localization file. More information visit [Vue i18n](https://vue-i18n.intlify.dev/).

```shell
npm install vue-i18n@10
mkdir -p src/i18n && touch src/i18n/lang.en.js src/i18n/lang.fr.js src/i18n/lang.ja.js src/i18n/lang.js
```

Replace content below to it respective file

```javascript
// src/i18n/lang.en.js
export default {
  welcome: "Welcome to Chit & Chat",
  slogan: "Where Hospitality Meets Home",
  btn_login: "Login",
  btn_create_enter: "Create & Enter",
};

// src/i18n/lang.fr.js
export default {
  welcome: "Bienvenue sur Chit & Chat",
  slogan: "Là où l'hospitalité rencontre la maison",
  btn_login: "Se connecter",
  btn_create_enter: "Créer et Entrer",
};

// src/i18n/lang.ja.js
export default {
  welcome: "チット＆チャットへようこそ",
  slogan: "おもてなしと家庭が出会う場所",
  btn_login: "ログイン",
  btn_create_enter: "作成して入力",
};

// src/i18n/lang.js
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
```

Import our recent created vue-i18n defined in `src/i18n/lang.js` file in `src/main.js`

```javascript
import i18n from "@/i18n/lang.js";

// add i18n to Vue app instance
createApp(App)
  .use(i18n)
// .... existing script ....
```

Replace content in `src/views/HomeView.vue` follow the instruction below.

```javascript
// change text below to i18n translation binding below
"Welcome to Chit & Chat"
"Where Hospitality Meets Home"
"Enter Our Home"
"forgot password?"
"Login"
'Create & Enter'

// i18n binding
{{ $t("welcome") }}
{{ $t("slogan") }}
{{ $t('login_banner') }}
{{ $t("forgot_password") }}
{{ $t("btn_login") }}
{{ $t("btn_create_enter") }}
```

Update `src/router/router.js` file with following instruction

1. Import `i18n` from `src/i18n/lang.js`

```javascript
import i18n from "@/i18n/lang";
```

2. If you've not handle route guard with `route.beforeEach` function yet, then add one other moving to next step

```javascript
router.beforeEach((to, from) = {});
```

3. Insert below code into anonymous function of `beforeEach`

```javascript
router.beforeEach((to, from) = {
  // .... existing code if any ....

  // redirect to default language english
  if (to.query.lang === undefined) {
    if (from.query.lang === undefined) {
      to.query.lang = "en";
    } else {
      to.query.lang = from.query.lang;
    }
    return to;
  }

  // guard by above code
  i18n.global.locale = to.query.lang;

  // .... existing code if any ....
});
```

# Exercise

1. Improve localization by replacing all static text (e.g., placeholders, error messages, button labels)
   with language keys or variables that can be dynamically translated.

2. Improve text color and background color when switch between dark and light theme.
