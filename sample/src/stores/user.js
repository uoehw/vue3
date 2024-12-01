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
      if (email === "invalid@nothing.forever") {
        return new Promise((resolve, reject) =>
          setTimeout(() => {
            reject(new Error("invalid email address"));
          }, 1500),
        );
      }
      // we add server request later on in the tutorial, for now we mock it only
      this.firstname = "Lucius";
      this.lastname = "Quintus";
      this.email = email;
      this.nickname = "Seraphina";
      // to simulate server post request we'll use timeout for 1.5sec delay
      return new Promise((resolve) => setTimeout(resolve, 1500));
    },

    async logout() {
      this.firstname = undefined;
      this.lastname = undefined;
      this.email = undefined;
      this.nickname = undefined;
    },
  },
});
