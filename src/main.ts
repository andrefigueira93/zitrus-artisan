import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import makeServer from "./server";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import "./assets/custom.scss";

Vue.config.productionTip = false;

makeServer();

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
