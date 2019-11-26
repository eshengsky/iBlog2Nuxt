import { ActionTree, MutationTree } from "vuex";

export const state = () => ({
  settings: {}
});
export type RootState = ReturnType<typeof state>;
export const mutations: MutationTree<RootState> = {
  setSettings(state, settings) {
    state.settings = settings;
  }
};
export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ commit }, { $axios }) {
    const { code, data } = await $axios.$get("/api/settings");
    if (code === 1) {
      commit("setSettings", data.settings);
    }
  }
};
