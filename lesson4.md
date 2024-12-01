# Unit Test

More information about why we want unit test visit [Vue official](https://vuejs.org/guide/scaling-up/testing) document.

Install [vitest.dev](vitest.dev).

```shell
npm install -D vitest
npm install -D jsdom
```

In `package.json` under the property `scripts` add `"test": "vitest"`

## Unit Test Functionality

We're building a form login system that redirects users to their respective homepages upon successful authentication.
To enhance security, we implement mechanisms redirect unauthenticated users back to the login page and redirect
authenticated users back to respective homepages.

Create two files `src/router/login_guard.js` and `src/router/login_guard.spec.js`

In `src/router/login_guard.js` file we'll implement a function that can be pass as argument to `router.beforeEach`.
Append javascript below to `src/router/login_guard.js` file.

```javascript
import { inject } from "vue";

export default function loginGuard(to, from) {
  // guard user instance
  const user = inject("user");

  if (to.path === "/" && user.email !== undefined) {
    if (from === undefined || from.fullPath === undefined) {
      return "/user";
    } else {
      return from.fullPath;
    }
  } else if (to.path !== "/" && user.email === undefined) {
    return "/";
  }
}
```

Append javascript below to `src/router/login_guard.spec.js` file.

```javascript
import { describe, expect, test } from "vitest";
import { createApp, provide } from "vue";
import loginGuard from "./login_guard";

function helper_test(name, fn) {
  test(name, () => {
    const app = createApp({
      setup() {
        fn();
      },
    });
  });
}

describe("login_guard", () => {
  helper_test("unauthorized access to user's page", () => {
    provide("user", { email: undefined });
    let path = loginGuard(
      { path: "/user", fullPath: "/?lang=en" },
      { path: "/", fullPath: "/?lang=en" },
    );
    expect(path).toBe("/"); // unauthenticated user need to redirect to login page
  });

  helper_test("authenticated access to login page", () => {
    provide("user", { email: "just@sample.com" });
    let path = loginGuard({ path: "/", fullPath: "/?lang=en" });
    expect(path).toBe("/user"); // authenticated user need to redirect to user's page

    path = loginGuard(
      { path: "/", fullPath: "/?lang=en" },
      { path: "/user/setting", fullPath: "/?lang=en" },
    );
    expect(path).toBe("/user/setting"); // authenticated user need to redirect to user's page
  });

  helper_test("authenticated access to user page", () => {
    provide("user", { email: "just@sample.com" });
    let path = loginGuard({ path: "/user", fullPath: "/?lang=en" });
    expect(path).toBe(undefined); // no redirect happen

    path = loginGuard(
      { path: "/user", fullPath: "/?lang=en" },
      { path: "/user/setting", fullPath: "/?lang=en" },
    );
    expect(path).toBe(undefined); // no redirect happen
  });
});
```

At the root of the project run command `npm run test`

## Unit Test a component

Install [Vue test util](https://test-utils.vuejs.org).

```shell
npm install --save-dev @vue/test-utils
```

Create `src/components/Sample.vue` file and append content below

```html
<script setup>
import { defineProps } from "vue";

const props = defineProps({
    picture: String,
    name: String,
});
</script>

<template>
    <div class="container">
        <div>
            <img :style="{ 'background-image': `url(` + picture + `)` }" />
            <div>
                <span>{{ name }}</span>
                <span class="static">Creative Personal</span>
            </div>
        </div>
        <button>Upgrade</button>
    </div>
</template>

<style scoped>
.container,
.container div:first-child div {
    display: flex;
    flex-direction: column;
}

.container div:first-child {
    display: flex;
    flex-direction: row;
    align-items: center;
}

img {
    width: 48px;
    height: 48px;
    background-clip: border-box;
    background-position: center;
    background-size: 48px;
    border-radius: 24px;
}

span {
    font-size: 1.2em;
    margin-left: 16px;
    font-weight: 800;
}

.static {
    font-size: 0.8em;
    font-weight: 100;
    color: darkslategray;
}

button {
    margin-top: 16px;
}
</style>
```

Create `src/components/Sample.spec.js` file and append content below

```javascript
// @vitest-environment jsdom

import { mount } from "@vue/test-utils";
import Sample from "./Sample.vue";
import { test, describe, expect } from "vitest";

describe("Sample", () => {
  test("Test properties", () => {
    const wrapper = mount(Sample, {
      props: {
        picture: "test.jpg",
        name: "malarin",
      },
    });

    expect(
      wrapper.find("div.container div div span:first-child").text(),
    ).toEqual("malarin");

    expect(wrapper.find("div.container div img").attributes("style")).toContain(
      "background-image: url(test.jpg)",
    );
  });
});
```
