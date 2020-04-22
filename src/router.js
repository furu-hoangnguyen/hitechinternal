import Vue from "vue";
import VueRouter from "vue-router";
import CreatePage from "./views/CreatePage.vue";
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/", name: "/", redirect: "/createpage" },
    { path: "/createpage", name: "/createpage", component: CreatePage },
  ],
});

export default router;
