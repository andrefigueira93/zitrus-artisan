import Vue from "vue";
import Vuex from "vuex";
import logger from "./plugins/logger";

import { snacks } from "./modules/snack.store";
import { auth } from "./modules/auth.store";
import { layout } from "./modules/layout.store";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store<any>({
  modules: {
    auth,
    layout,
    snacks,
  },
  devtools: true,
  plugins: debug ? [logger()] : [],
});
