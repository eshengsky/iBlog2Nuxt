const minLoadingTimeout = 1000;
export default {
    state: () => ({
        article: {
            category: {}
        },
        drawer: false,
        user: null
    }),

    mutations: {
        // 提交更改，支持批量提交
        setData(state, data) {
            Object.keys(data).forEach(key => {
                state[key] = data[key];
            });
        }
    },

    actions: {
        nuxtServerInit({ commit }, { req }) {
            if (req.user) {
                commit('setData', {
                    user: req.user
                })
            }
        },

        async getArticle({ commit, state }) {
            let article = { category: {} };
            try {
                const { data } = await this.$axios.$get('/api/article', {
                    params: {
                        alias: state.articleAlias
                    }
                });
                article = data.article;
            } catch (err) {
                console.error(err);
            }
            commit('setData', {
                article
            });
        },

        async getGuestbook({ commit, state }) {
            let guestbook = [];
            try {
                const { data } = await this.$axios.$get('/api/guestbook');
                guestbook = data.guestbook;
            } catch (err) {
                console.error(err);
            }
            commit('setData', {
                guestbook
            });
        },

        async saveComment({ state }, payload) {
            return await this.$axios.$post('/api/saveComment', {
                articleId: state.article._id,
                pathId: payload.pathId,
                content: payload.content
            });
        },

        async saveGuestbook({ state }, payload) {
            return await this.$axios.$post('/api/saveGuestbook', {
                pathId: payload.pathId,
                content: payload.content
            });
        }
    }
}
