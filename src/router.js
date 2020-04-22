import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import HitechLayout from "@/layout/HitechLayout.vue";
import Login from "@/views/Login";
import Home from "@/views/Home";
import AccountReceivables from "@/views/AccountReceivables";

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
      component: Login
    },
    {
      path: "/",
      component: HitechLayout,
      children: [
        {
          path: "/home",
          name: "home",
          component: Home
        },
        {
          path: "/account-receivables",
          name: "account-receivables",
          component: AccountReceivables
        }
      ]
    }
  ],
});

export default router;