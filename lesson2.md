# Create Store

In this sample tutorial, we'll use official recommend and certified Vue store for Vue3.
Visit [Pinia](https://pinia.vuejs.org/) for more details.

- Install Pinia

```shell
npm install pinia
```

- Add Pina into Vue App instance in the file `src/main.js`

```javascript
// import Pinia creator function
import { createPinia } from "pinia";

// .... existing code

createApp(App)
  .use(createPinia())
  .use(router).mount("#app");
```

- Create Store directory and store handler

```shell
mkdir -p src/stores && touch src/stores/user.js
```

- Add below script into file `src/stores/user.js`

```javascript
import { defineStore } from "pinia";

// user store is used for storing user data of current logged in user
export const useUserStore = defineStore("user", {
  state: () => ({
    // this a user object, which contain
    // first name
    // last name
    // email
    // nickname
    // or more
  }),
  actions: {
    async login(email, password) {
      // we add server request later on in the tutorial, for now we mock it only
      this.firstname = "Lucius";
      this.lastname = "Quintus";
      this.email = email;
      this.nickname = "Seraphina";
      // to simulate server post request we'll use timeout for 1.5sec delay
      return new Promise((resolve) => setTimeout(resolve, 1500));
    },
  },
});
```

- Add store and login handler to `src/views/HomeView.vue`, modified script according to script below

```javascript
<script setup>
  // ... existing import

  // use for reference in model bind to input value
  import { ref } from 'vue';

  // import user store here
  import { useUserStore } from "@/stores/user.js";

  // create user store object
  const user = useUserStore();

  // user input data
  const userInfo = {
    email: ref(''),
    password: ref(''),
    password_confirmation: ref(''),
  };

  // handle login
  async function handleLogin(event) {
    event.preventDefault();
  }

  // handle create and join
  async function handleCreateAndJoin(event) {
    event.preventDefault();
  }
</script>
```

- Binding submit prevention handler in file `src/views/HomeView.vue`

```html
<!-- .... existing code .... -->
<span class="home">Enter Our Home</span>
<form @submit.prevent="handleLogin">

<!-- .... existing code .... -->
<span class="or">or</span>
<form @submit.prevent="handleCreateAndJoin">
```

- Binding form value with `userInfo` object. For more information visit [Vue form binding](https://vuejs.org/guide/essentials/forms.html).

```html
<!-- replace or update these lines of code -->
<input placeholder="email" type="text" />
<input placeholder="password" type="password" />

<!-- new code -->
<input v-model="userInfo.email.value" placeholder="email" type="text" />
<input v-model="userInfo.password.value" placeholder="password" type="password" />
```

- Append login code below into javascript function `handleLogin`

```javascript
await user.login(userInfo.email.value, userInfo.password.value);
```

This example showcases the basic functionality of a Vue store. To observe how the store updates, you can add
`console.log(user.email)` within the handleLogin function. This will log the user's email upon successful login.

Currently, the UI lacks feedback during the login process. After clicking the login button, there's no visual
indication of the ongoing request (simulating a server call), and users can click the button repeatedly.
Additionally, there's no validation for empty login forms.

In the next section, we'll improve the user experience by updating `src/views/HomeView.vue`.

# Handle Error

Why should we handle error?

- Network request failed due to internet connection issues
- Server response failed due to issues existing within the server
- Login failed due to incorrect password or email not found
- user does not enter and information in the form

**Goal**

- Once data is submitted, the form should be locked to prevent further modifications. This includes disabling all input
  fields and the submit button. However, other UI elements, such as tooltips, help text, or navigation links, that do
  not interfere with the submission process should remain functional.
- If any errors occur during the data submission process, a specific and user-friendly error message should be presented
  to the user. This message should clearly explain the nature of the error, such as invalid input, network issues, or
  server errors. By providing this information, users can easily identify and rectify the problem, allowing them to resubmit
  their data successfully.

## Using native browser required field

To enforce mandatory input for critical fields, apply the required attribute to all necessary input elements of type text.
This includes, but is not limited to, email and password fields.

```html
<input required /> <!-- Note: this is just sample, all other attribute and binding should remain in place -->
```

## Add minimal loading animation

Modified `<script setup>` in `src/views/HomeView.vue` as below

```javascript
// .... existing code

// state indicate whether we're currently the process of submit data to server.
const isSubmitting = ref(false);

// handle login
async function handleLogin(event) {
    isSubmitting.value = true; // disable input and button and show progress indicator
    event.preventDefault();
    // .... existing code
    isSubmitting.value = false; // re-enable input and button and hide progress indicator
}

// handle create and join
async function handleCreateAndJoin(event) {
    isSubmitting.value = true;
    event.preventDefault();
}
```

Binding disabling state in all `input` and `button` element. For more information visit [Vue conditional rendering](https://vuejs.org/guide/essentials/conditional.html).
Similar to `required` attribute above add `:disabled="isSubmitting"` to all `input` and `button` element.

In `src/views/HomeView.vue` replace or update button text content `Login` and `Create and Enter` with below code respectively.

```html
<!-- .... existing code .... -->

<div>
    <div class="loader" v-if="isSubmitting"></div>
    <span v-if="!isSubmitting">Login</span>
</div>

<!-- .... existing code .... -->

<div>
    <div class="loader" v-if="isSubmitting"></div>
    <span v-if="!isSubmitting">Create and Enter</span>
</div>

<!-- .... existing code .... -->
```

Append minial loading animation to `style` in the file `src/views/HomeView.vue`

```css
button div {
    display: flex;
    justify-items: center;
    align-items: center;
}

.loader {
    width: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 4px solid #0000;
    border-right-color: #ffa50097;
    position: relative;
    animation: l24 1s infinite linear;
}
.loader:before,
.loader:after {
    content: "";
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: inherit;
    animation: inherit;
    animation-duration: 2s;
}
.loader:after {
    animation-duration: 4s;
}
@keyframes l24 {
    100% {
        transform: rotate(1turn);
    }
}
```

## Handle Network Error or Server related

What could happen ?

- Username invalid or not found
- Password is incorrect
- Internet connection failure
- Server down or internal issues

To demonstrate error handling without a real server, we'll use a specific email address, `invalid@nothing.forever`,
to intentionally trigger a login failure. This will allow us to simulate a real-world scenario and test how the
application responds to errors.

Add the following code to the beginning of the login function in the `src/stores/user.js` file.

```javascript
async login(email, password) {
  if (email === "invalid@nothing.forever") {
    return new Promise((resolve, reject) =>
      setTimeout(() => {
        reject(new Error("invalid email address"));
      }, 1500),
    );
  }

  // .... existing code ....
}
```

Add the following code below variable `isSubmitting` in the `src/views/HomeView.vue` file.

```javascript
// state indicate whether we've an error
const recentError = ref();
```

Add catch error to await `login` function

```javascript
await user
    .login(userInfo.email.value, userInfo.password.value)
    .catch((err) => {
        recentError.value = err;
    });
```

Add a `span` element to toggling display error message below the `login` submit `button`.

```html
<span class="error" v-if="!recentError">
    {{ recentError?.message }}
</span>
```

Finally append a style below to `src/views/HomeView.vue` file.

```css
span.error {
    margin-top: 12px;
    color: red;
    align-self: flex-start;
    font-size: 1.1em;
    font-weight: 300 !important;
}
```

# User's Home

After login successfully, user should be navigated to their home page.

- Create a user home page

```shell
touch src/views/UserHomeView.vue
```

- Add code below into `src/views/UserHomeView.vue` file

```html
<script setup>
import AppBackground from "../components/AppBackground.vue";
import { useUserStore } from "@/stores/user.js";

// create user store object
const user = useUserStore();
</script>

<template>
    <div class="container">
        <AppBackground />
        <div class="content">
            <span class="welcome">Welcome home!</span>
            <span class="name">{{ user.firstname }} {{ user.lastname }}</span>
        </div>
    </div>
</template>

<style scoped>
div.container {
    position: relative;
    height: 100vh;
}

div.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

span.welcome {
    font-weight: 400;
    font-style: normal;
    text-align: center;
    font-size: 3.5em;
    color: var(--sample-primary-color-1);
    font-family: "Great Vibes", cursive;
}

span.name {
    font-weight: 400;
    font-size: 1.8em;
    font-family: "Edu AU VIC WA NT Pre", cursive;
}
</style>
```

- Update `src/router/router.js` with below instruction:

```javascript
// import HomeView at the top of the file
import UserHomeView from "../views/UserHomeView.vue";

const routes = [
  // ---- existing route
  {
    path: '/user',
    name: 'user',
    component: UserHomeView,
  },
];
```

- Modified `src/views/HomeView.vue` to push router to a the user's home view when login successfully.

```javascript
// .... existing code
import { useRouter } from 'vue-router';

// .... existing code
const router = useRouter();

// .... existing code
async function handleLogin(event) {
  // .... existing code
  await user
      .login(userInfo.email.value, userInfo.password.value)
      .then(() => router.push({ name: "user" })) // name `user` must be the same as name define in the router.
      .catch((err) => {
          recentError.value = err;
      });

// .... existing code
```

# Exercise

While numerous enhancements have been implemented, residual logical errors persist within the code. To solidify
your understanding, please analyze the code, pinpoint the specific issues, and rectify them accordingly.

1. When the "Login" button is clicked, a loading animation should be displayed to indicate that the system is
   processing the request. Conversely, the "Create & Enter" button should be disabled but should not display
   a loading animation, as it is not directly involved in the login process.

2. When an error occurs, an error message should be displayed to inform the user. However, this message should
   not persist indefinitely. It should automatically disappear once the user re-logs in or interacts with any
   input field on the page.

3. Enhance user experience by automatically populating the email input field with the email address entered in
   the login form, if applicable.

4. After login router should clear history and user should not be able to click back button on the browser.

5. Add logout on `src/views/UserHomeView.vue` to return to `src/views/HomeView.vue`. The same for login, logout
   should prevent user from returning back and all user data should clear as well.

6. If user has't login enter the address manually should automatically return user to login page.
