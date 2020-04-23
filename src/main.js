import Vue from "vue";
import App from "./App.vue";
import store from "./store/index";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import router from "./router";

import "./plugin";
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;
require("./assets/scss/main.scss");
new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
