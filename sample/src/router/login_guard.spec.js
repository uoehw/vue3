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

  helper_test("authenticated access to user pages", () => {
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
