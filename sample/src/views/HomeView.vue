<script setup>
import AppBackground from "../components/AppBackground.vue";
import ThemeSwitch from "@/components/ThemeSwitch.vue";
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useUserStore } from "@/stores/user.js";

const IDLE = 0; // no networking progress
const LOGIN = 1; // login is in progress
const CREATEENTER = 2; // create and enter is in progress

const pgState = {
    // create user store object
    user: useUserStore(),

    // login input data
    loginInfo: {
        email: ref(""),
        password: ref(""),
    },

    // create & enter input data
    createEnterInfo: {
        email: ref(""),
        password: ref(""),
        password_confirmation: ref(""),
    },

    // state indicate whether we're currently submit data to the server server.
    // state 0 nothing happen, 1 login in progress and 2 create & enter in progress
    netState: ref(0),

    // state indicate whether we've an error while login
    loginError: ref(),

    // state indicate whether we've an error while create & enter
    createEnterError: ref(),

    // router instance
    router: useRouter(),

    // whether login is in progress
    get isLogin() {
        return this.netState.value === LOGIN;
    },

    // whether create & enter is in progress
    get isCreateEnter() {
        return this.netState.value === CREATEENTER;
    },

    // whether network request is in progress
    get isProgressing() {
        return this.netState.value !== IDLE;
    },

    // update network state, value is IDLE, LOGIN, CREATEENTER, see above constant variable
    set netowrkState(value) {
        this.netState.value = value;
    },

    // handle login
    handleLogin: async function (event) {
        this.netowrkState = LOGIN; // disable input and button and show progress indicator
        event.preventDefault();
        await this.loginOrCreate();
        this.netowrkState = IDLE; // re-enable input and button and hide progress indicator
    },

    // handle create and join
    handleCreateAndJoin: async function (event) {
        this.netowrkState = CREATEENTER;
        event.preventDefault();
        if (
            this.createEnterInfo.password.value ===
            this.createEnterInfo.password_confirmation.value
        ) {
            await this.loginOrCreate();
        } else {
            this.createEnterError.value = new Error("password does not match");
        }
        this.netowrkState = IDLE;
    },

    loginOrCreate: async function () {
        await pgState.user
            .login(
                pgState.loginInfo.email.value,
                pgState.loginInfo.password.value,
            )
            .then(() => pgState.router.push({ name: "user", replace: true }))
            .catch((err) => {
                this.loginError.value = err;
            });
    },

    createEmailFocus: function (event) {
        if (
            this.loginInfo.email.value !== "" &&
            this.createEnterInfo.email.value === ""
        ) {
            this.createEnterInfo.email.value = this.loginInfo.email.value;
        }
        this.resetError(event);
    },

    resetError: async function (event) {
        pgState.loginError.value = undefined;
        pgState.createEnterError.value = undefined;
    },
};
</script>

<template>
    <AppBackground />
    <ThemeSwitch />
    <div class="login">
        <div>
            <span class="welcome">{{ $t("welcome") }}</span>
            <span class="slogan">{{ $t("slogan") }}</span>
        </div>
        <div>
            <span class="home">{{ $t("login_banner") }}</span>
            <form @submit.prevent="pgState.handleLogin">
                <div class="input_data">
                    <input
                        @focus="pgState.resetError"
                        v-model="pgState.loginInfo.email.value"
                        placeholder="email"
                        type="text"
                        required
                        :disabled="pgState.isProgressing"
                    />
                    <input
                        @focus="pgState.resetError"
                        v-model="pgState.loginInfo.password.value"
                        placeholder="password"
                        type="password"
                        required
                        :disabled="pgState.isProgressing"
                    />
                    <RouterLink to="/under_construction">{{
                        $t("forgot_password")
                    }}</RouterLink>
                    <button type="submit" :disabled="pgState.isProgressing">
                        <div>
                            <div class="loader" v-if="pgState.isLogin"></div>
                            <span v-if="!pgState.isLogin">{{
                                $t("btn_login")
                            }}</span>
                        </div>
                    </button>
                    <Transition name="slide-fade">
                        <span class="error" v-if="!!pgState.loginError.value">
                            {{ pgState.loginError?.value?.message }}
                        </span>
                    </Transition>
                </div>
            </form>
            <span class="or">or</span>
            <form @submit.prevent="pgState.handleCreateAndJoin">
                <div class="input_data">
                    <input
                        @focus="pgState.createEmailFocus"
                        placeholder="email"
                        v-model="pgState.createEnterInfo.email.value"
                        required
                        type="text"
                        :disabled="pgState.isProgressing"
                    />
                    <input
                        @focus="pgState.resetError"
                        placeholder="password"
                        required
                        type="password"
                        v-model="pgState.createEnterInfo.password.value"
                        :disabled="pgState.isProgressing"
                    />
                    <input
                        @focus="pgState.resetError"
                        placeholder="password confirmation"
                        type="password"
                        required
                        v-model="
                            pgState.createEnterInfo.password_confirmation.value
                        "
                        :disabled="pgState.isProgressing"
                    />
                    <button type="submit" :disabled="pgState.isProgressing">
                        <div>
                            <div
                                class="loader"
                                v-if="pgState.isCreateEnter"
                            ></div>
                            <span v-if="!pgState.isCreateEnter">{{
                                $t("btn_create_enter")
                            }}</span>
                        </div>
                    </button>
                    <Transition name="slide-fade">
                        <span
                            class="error"
                            v-if="!!pgState.createEnterError.value"
                        >
                            {{ pgState.createEnterError?.value?.message }}
                        </span>
                    </Transition>
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

button[type="submit"] {
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

span.error {
    margin-top: 12px;
    color: red;
    align-self: flex-start;
    font-size: 1.1em;
    font-weight: 300 !important;
}

.slide-fade-enter-active {
    transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
</style>
