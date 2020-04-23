import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login")
    },

    {
      path: "/home",
      name: "home",
      component: () => import("@/views/Home")
    }
  ],
});

export default router;