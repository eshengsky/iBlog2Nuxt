import { ActionTree, MutationTree } from 'vuex';
export const state = () => ({
    /** 用户 */
    user: null
});
export type RootState = ReturnType<typeof state>;
export const mutations: MutationTree<RootState> = {
    setUser(state, user: any) {
        state.user = user;
    },
};
export const actions: ActionTree<RootState, RootState> = {
    nuxtServerInit({ commit }, { req }) {
        if (req.user) {
            commit("setUser", req.user);
        }
    }
}
