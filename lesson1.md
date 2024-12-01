# Prerequirement

- latest [nodejs](https://nodejs.org/) installed
- Optional linux environment, the command and setup is based on linux environment.

# Create VueJS project

> **Note:** To gain full control over your project structure, choose **_No_** during the setup
process. We'll walk you through the manual creation of components and other configurations
step-by-step in this document. For this example, we'll name the project "sample" but you can
easily adapt it to your specific needs.

```shell
npm create vue@latest
...
cd sample
npm install
```

Clean the generate projects:

```shell
rm -rf src/assets/* src/components/*
echo "" > src/App.vue
```

Add minimal stytesheets

- Create `main.css` file `src/assets/main.css` and append below content to reset body padding

```css
/* style color variable use as theming */
:root {
    --sample-primary-dark-color-1: #1f2544;
    /*--sample-primary-light-color-1: #TBD; */

    --sample-primary-dark-color-2: #474f7a;
    /*--sample-primary-light-color-2: #TBD; */

    --sample-secondary-dark-color-1: #81689d;
    /*--sample-secondary-light-color-1: #TBD; */

    --sample-secondary-dark-color-2: #ffd0ec;
    /*--sample-secondary-light-color-2: #TBD; */

    /*color that does not depend on dark or light theme*/
    --sample-input-text-focus-color: #2d9fd9;
}

:root {
    --sample-primary-color-1: var(--sample-primary-dark-color-1);
    --sample-primary-color-2: var(--sample-primary-dark-color-2);
    --sample-secondary-color-1: var(--sample-secondary-dark-color-1);
    --sample-secondary-color-2: var(--sample-secondary-dark-color-2);
}

body {
    padding: 0;
    margin: 0;
}
```

For better UI, we're using custom font from Google, thus add below html code into `head` tag in file `index.html`.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
    href="https://fonts.googleapis.com/css2?family=Edu+AU+VIC+WA+NT+Pre:wght@400..700&family=Great+Vibes&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap"
    rel="stylesheet"
/>
```

# Create VueJS Router

> **Note:** Feel free to experiment with different routing libraries to find the best fit for
your project. However, for the purpose of these examples, we'll be focusing on the official
[routing](https://router.vuejs.org/) library to provide a solid foundation for your understanding.

Add the below template code into file `src/App.vue`:

```html
<script setup>
import "@/assets/main.css";
import { RouterView } from "vue-router";
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>
```

Add Vue Router library into the project:

```shell
npm install vue-router@4
```

Create router instance file `src/router/router.js` and add below code:

```shell
mkdir -p src/router && touch src/router/router.js
```

```javascript
import { createWebHistory, createRouter } from "vue-router";

const routes = [];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
```

We'll leave the router instance with empty route for now, we'll add them later as we go deep through this tutorial.

Modified the file `src/main.js` to add router instance into Vue App instance.

```javascript
// add this line at the top to import the router install
import router from "./router/router.js";

// replace or update this line with below code
createApp(App).mount('#app')

// new code which add the router instance to Vue App
createApp(App).use(router).mount("#app");
```

If you run `npm run dev` and access `http://localhost:5173/` via the browser, you will
see the a blank page loaded. We're done setup basic Vue project with VueJS offical router.

# Create Background Component

We need a consistent background across our samples. Although it’s just an SVG file, a
standalone SVG cannot utilize CSS variables, making it impossible to dynamically update the SVG's
color based on themes such as `light` and `dark`. Therefore, we need to embed this SVG as a component instead.

```shell
touch src/components/AppBackground.vue
```

Add the below template code.

```html
<template>
    <div class="background">
        <svg
            viewBox="0 0 1797 992"
            preserveAspectRatio="xMidYMid"
            width="1797"
            height="992"
        >
            <g>
                <linearGradient y2="0" y1="0" x2="1" x1="0" id="lg-nq4q5u6dq7r">
                    <stop
                        offset="0"
                        id="start-color"
                        stop-color="var(--sample-primary-color-1)"
                    ></stop>
                    <stop
                        offset="1"
                        id="end-color"
                        stop-color="var(--sample-secondary-color-2)"
                    ></stop>
                </linearGradient>
                <path
                    opacity="0.4"
                    fill="url(#lg-nq4q5u6dq7r)"
                    d="M 0 0 L 0 625.082 Q 179.7 824.582 359.4 782.732 T 718.8 558.602 T 1078.2 673.137 T 1437.6 675.805 T 1797 433.923 L 1797 0 Z"
                ></path>
                <path
                    opacity="0.4"
                    fill="url(#lg-nq4q5u6dq7r)"
                    d="M 0 0 L 0 663.209 Q 179.7 654.162 359.4 632.802 T 718.8 772.397 T 1078.2 709.697 T 1437.6 608.312 T 1797 626.772 L 1797 0 Z"
                ></path>
            </g>
        </svg>
    </div>
</template>

<style scoped>
div.background {
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-clip: border-box;
    overflow: hidden;
    position: absolute;
}
</style>
```

# Create HomeView

We need to add a home page to our project. Initially, we'll use a login page as the entry point.

```shell
mkdir -p src/views
touch src/views/HomeView.vue
```

Add template code below into file `src/views/HomeView.vue`

```html
<script setup>
import AppBackground from "../components/AppBackground.vue";
</script>

<template>
    <AppBackground />
    <div class="login">
        <div>
            <span class="welcome">Welcome to Chit & Chat</span>
            <span class="slogan">Where Hospitality Meets Home</span>
        </div>
        <div>
            <span class="home">Enter Our Home</span>
            <form>
                <div class="input_data">
                    <input placeholder="email" type="text" />
                    <input placeholder="password" type="password" />
                    <a>forgot password?</a>
                    <button type="submit">Login</button>
                </div>
            </form>
            <span class="or">or</span>
            <form>
                <div class="input_data">
                    <input placeholder="email" type="text" />
                    <input placeholder="password" type="password" />
                    <input
                        placeholder="password confirmation"
                        type="password"
                    />
                    <button type="submit">Create & Enter</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
div.login {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

div.login div {
    display: flex;
    flex-direction: column;
}

div.login div:first-child {
    margin-right: 32pt;
}

div.login div:last-child {
    margin-left: 32pt;
    font-family: "Roboto Condensed", sans-serif;
}

div.login div span {
    font-weight: 400;
    font-style: normal;
    text-align: center;
}

span.welcome {
    font-size: 3.5em;
    color: var(--sample-primary-color-1);
    font-family: "Great Vibes", cursive;
}

span.slogan {
    font-size: 1.2em;
    color: white;
    font-family: "Edu AU VIC WA NT Pre", cursive;
    font-optical-sizing: auto;
    font-weight: 700;
}

span.home {
    font-size: 1.8em;
    color: var(--sample-primary-color-1);
    font-optical-sizing: auto;
    font-weight: 200;
    font-style: normal;
}

div.input_data {
    display: flex;
    flex-direction: columns;
    margin: 32pt;
}

input[type="text"],
input[type="password"] {
    border-radius: 8px;
    border: 1px solid var(--sample-secondary-color-2);
    color: #a0d18c;
    width: 280px;
    padding: 12px 16px 12px 16px;
    margin-bottom: 8pt;
    color: black;
}

input[type="text"]:focus,
input[type="password"]:focus {
    outline: none;
    border: 1px solid var(--sample-input-text-focus-color);
}

input[type="button"] {
    margin-top: 16px;
    border-radius: 8px;
    border: 1px solid var(--sample-secondary-color-1);
    padding: 12px;
    background-color: var(--sample-primary-color-2);
    color: white;
}

div.input_data a {
    margin: 12px;
}

span.or {
    position: relative;
    font-size: 1em;
}

span.or::before,
span.or::after {
    content: "";
    position: absolute;
    height: 1px;
    background-color: color-mix(
        in srgb,
        var(--sample-primary-color-1) 40%,
        transparent
    );
    top: 10px;
}

span.or::before {
    left: 45px;
    width: 32%;
}

span.or::after {
    right: 45px;
    width: 32%;
}
</style>
```

Update `src/router/router.js` with below instruction:

```javascript
// import HomeView at the top of the file
import HomeView from "../views/HomeView.vue";

// update routes `const routes = [];`
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
];
```

The content of `http://localhost:5173/` should be automatically updated.

# Create Under Construction View

Create under construction view.

```shell
touch src/views/UnderConstructionView.vue
```

Create sample logo to be used in under construction view.

```shell
mkdir -p src/assets/images && touch src/assets/images/server.svg
```

Go to [reshot.com](https://www.reshot.com/free-svg-icons/item/traffic-cone-8CRH5WVN9S/), then copy the SVG code
and add it into the file `src/assets/images/server.svg`

Append the below template code into the file.

```html
<script setup>
import AppBackground from "../components/AppBackground.vue";
</script>

<template>
    <AppBackground />
    <div class="container">
        <span class="logo"></span>
        <div>
            <span>Oops!</span>
            <span>Page is under construction</span>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container span.logo {
    width: 280px;
    height: 280px;
    background-image: url("@/assets/images/server.svg");
}

.container div {
    display: flex;
    flex-direction: column;
    justify-content: end;
    margin-left: 48px;
    margin-bottom: 18px;
    height: 30%;
    width: 40%;
    font-family: "Roboto Condensed", sans-serif;
}

.container span:first-child {
    font-size: 4.5em;
}

.container span:last-child {
    font-size: 1.9em;
}
</style>
```

Update `src/router/router.js` with below instruction:

```javascript
// import UnderConstructionView at the top of the file
import UnderConstructionView from "../views/UnderConstructionView.vue";

// add a route to the routes variable
const routes = [
  // .... other existing route ....
  {
    path: '/under_construction',
    name: 'under_construction',
    component: UnderConstructionView,
  },
];
```

Next we add navigation function to the under construction view. To do so we we need to update
file `src/views/HomeView.vue` with below instruction.

- Import `RouterLink` in `src/views/HomeView.vue`

```html
<script setup>
// .... existing import
import { RouterLink } from "vue-router";
</script>
```

- Replace a line `<a>forgot password?</a>` with `<RouterLink to="/under_construction">forgot password?</RouterLink>`

The content of `http://localhost:5173/` should be automatically updated. Click on `forgot password`, the page will be
navigate to under construction view.
