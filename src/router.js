import Vue from "vue";
import VueRouter from "vue-router";
import RequestAccountPage from "@/views/RequestAccountPage.vue";
import RequestAccountConfirmPage from "@/views/RequestAccountConfirmPage.vue";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", name: "/", redirect: "/RequestAccountPage" },
    {
      path: "/RequestAccountPage",
      name: "/RequestAccountPage",
      component: RequestAccountPage,
    },
    {
      path: "/RequestAccountConfirmPage",
      name: "/RequestAccountConfirmPage",
      component: RequestAccountConfirmPage,
    },
  ],
});

export default router;
