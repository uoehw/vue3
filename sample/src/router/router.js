import { createWebHistory, createRouter } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { inject } from "vue";
import i18n from "@/i18n/lang";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/under_construction",
    name: "under_construction",
    component: () => import("../views/UnderConstructionView.vue"),
  },
  {
    path: "/user",
    name: "user",
    component: () => import("../views/UserHomeView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  // guard user instance
  const user = inject("user");

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

  // if go home and user has logged in, return false this prevent and any push
  // back without properly logged out or clean user data
  if (to.path === "/" && user.email !== undefined) {
    return from.fullPath;
  } else if (to.path !== "/" && user.email === undefined) {
    return "/";
  }
});

export default router;
