const minLoadingTimeout = 1000;
export default {
    state: () => ({
        categoryList: [],
        postList: [],
        cateId: '',
        page: 1,
        hasNext: false,
        loading: false,
        articleAlias: '',
        article: {
            category: {}
        },
        drawer: false,
        filterType: 'text',
        keyword: '',
        sortBy: 'date',
        user: null,
        guestbook: []
    }),

    mutations: {
        // 提交更改，支持批量提交
        setData(state, data) {
            Object.keys(data).forEach(key => {
                state[key] = data[key];
            });
        },

        // 提交数组的附加更改，支持批量提交
        appendData(state, data) {
            Object.keys(data).forEach(key => {
                state[key] = [...state[key], ...data[key]];
            });
        }
    },

    actions: {
        async getCategories({ commit }) {
            let result = [];
            try {
                const { data } = await this.$axios.$get('/api/categories');
                result = data;
            } catch (err) {
                console.error(err);
            }
            commit('setData', {
                categoryList: result
            });
        },

        async getPosts({ commit, state }) {
            const startTime = new Date();
            let postList = [];
            let hasNext = false;
            commit('setData', {
                loading: true
            });
            try {
                const { data } = await this.$axios.$get('/api/posts', {
                    params: {
                        cateId: state.cateId,
                        pageIndex: state.page,
                        filterType: state.filterType,
                        keyword: state.keyword,
                        sortBy: state.sortBy
                    }
                });
                postList = data.postList;
                hasNext = data.hasNext;
            } catch (err) {
                console.error(err);
            }

            // loading 时间过短体验也不好，这里设置一个最少 loading 时间
            const duration = new Date() - startTime;
            const timeout = duration > minLoadingTimeout ? 0 : (minLoadingTimeout - duration);
            setTimeout(() => {
                commit('appendData', {
                    postList
                });
                commit('setData', {
                    hasNext,
                    loading: false
                });
            }, timeout);
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
            try {
                await this.$axios.$post('/api/saveComment', {
                    articleId: state.article._id,
                    username: state.user.username,
                    displayName: state.user.displayName,
                    avatar: state.user._json.avatar_url,
                    pathId: payload.pathId,
                    content: payload.content
                });
            } catch (err) {
                console.error(err);
            }
        },

        async saveGuestbook({ state }, payload) {
            try {
                await this.$axios.$post('/api/saveGuestbook', {
                    username: state.user.username,
                    displayName: state.user.displayName,
                    avatar: state.user._json.avatar_url,
                    pathId: payload.pathId,
                    content: payload.content
                });
            } catch (err) {
                console.error(err);
            }
        }
    }
}
