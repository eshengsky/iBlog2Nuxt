import { ActionTree, MutationTree } from 'vuex';

export const state = () => ({
    /** 用户 */
    user: null,
    settings: {}
});
export type RootState = ReturnType<typeof state>;
export const mutations: MutationTree<RootState> = {
    setUser(state, user: any) {
        state.user = user;
    },
    setSettings(state, settings) {
        state.settings = settings;
    }
};
export const actions: ActionTree<RootState, RootState> = {
    async nuxtServerInit({ commit }, { req, $axios }) {
        if (req.user) {
            commit("setUser", req.user);
        }
        const { code, data } = await $axios.$get('/api/settings');
        if (code === 1) {
            commit("setSettings", data.settings);
        }
    }
}
