import { StoreOptions } from "vuex";
import AuthService from "@/services/AuthService";
import store from "@/store";

export interface IUser {
  id: number;
  username: string;
  password: string;
}

export interface AuthStoreState {
  user: Partial<IUser> | null;
  authenticated: boolean;
}

const storageUser = localStorage.getItem("zitrusArtisan:user");
const initialState = storageUser
  ? { user: JSON.parse(storageUser), authenticated: true }
  : { user: null, authenticated: false };

type AuthStore = StoreOptions<AuthStoreState> & {
  namespaced: boolean;
};

export const auth: AuthStore = {
  namespaced: true,
  state: initialState,
  mutations: {
    loginSuccess(state, user) {
      state.authenticated = true;
      state.user = user;
    },
    loginFailure(state) {
      state.authenticated = false;
      state.user = null;
    },
    signOut(state) {
      state.authenticated = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.authenticated = false;
    },
    registerFailure(state) {
      state.authenticated = false;
    },
  },
  actions: {
    signOut({ commit }) {
      AuthService.signOut();
      store.dispatch("layout/setLayout", "simple-layout");
      commit("signOut");
    },
    async signIn({ commit }, user: IUser) {
      try {
        const { data, error } = await AuthService.signIn(user);

        if (error) {
          throw error;
        }

        commit("loginSuccess", data);

        return Promise.resolve(data);
      } catch (error) {
        commit("loginFailure");
        return Promise.reject(error);
      }
    },
    async register({ commit }, user: IUser) {
      try {
        const { data, error } = await AuthService.register(user);
        if (error) {
          throw error;
        }
        commit("registerSuccess");
        return Promise.resolve(data);
      } catch (error) {
        commit("registerFailure");
        return Promise.reject(error);
      }
    },
  },
  getters: {
    user: (state) => state.user,
    authenticated: (state) => state.authenticated,
  },
};
