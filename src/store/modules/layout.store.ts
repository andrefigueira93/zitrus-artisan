import { StoreOptions } from "vuex";

export interface LayoutStoreState {
  mode: string;
}

type ILayout = StoreOptions<LayoutStoreState> & {
  namespaced: boolean;
};

const storageLayout = localStorage.getItem("zitrusArtisan:layout");
const initialLayout = storageLayout
  ? JSON.parse(storageLayout)
  : "simple-layout";

export const layout: ILayout = {
  namespaced: true,
  state: {
    mode: initialLayout,
  },
  mutations: {
    setLayout(state, payload) {
      state.mode = payload;
    },
  },
  actions: {
    setLayout({ commit }, payload) {
      localStorage.setItem("zitrusArtisan:layout", JSON.stringify(payload));
      commit("setLayout", payload);
    },
  },
  getters: {
    mode(state) {
      return state.mode;
    },
  },
};
