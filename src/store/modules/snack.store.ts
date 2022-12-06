import { StoreOptions } from "vuex";

export interface ISnack {
  id?: number;
  color: string;
  message: string;
  timeout?: number;
  show?: boolean;
}

export interface SnackStoreState {
  records: ISnack[];
}

type SnackStore = StoreOptions<SnackStoreState> & {
  namespaced: boolean;
};

export const snacks: SnackStore = {
  namespaced: true,
  state: {
    records: [],
  },
  mutations: {
    snackAdded(state, snack: ISnack) {
      const newSnack = {
        ...snack,
        id: state.records.length + 1,
        show: true,
        timeout: snack.timeout ?? 3000,
      };
      state.records.push(newSnack);

      setTimeout(() => {
        state.records = state.records.filter((s) => s.id !== newSnack.id);
      }, newSnack.timeout);
    },
    snackRemoved(state, snackId: number) {
      state.records = state.records.filter((s) => s?.id !== snackId);
    },
    snackUpdated(state, snack: ISnack) {
      state.records = state.records.map((s) => {
        if (s?.id === snack.id) {
          return snack;
        }
        return s;
      });
    },
  },
  actions: {
    addSnack({ commit }, snack: ISnack) {
      commit("snackAdded", snack);
    },
    removeSnack({ commit }, snackId: number) {
      commit("snackRemoved", snackId);
    },
    updateSnack({ commit }, snack: ISnack) {
      commit("snackUpdated", snack);
    },
  },
  getters: {
    getSnacks(state) {
      return state.records;
    },
  },
};
