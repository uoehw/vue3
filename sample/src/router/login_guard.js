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
