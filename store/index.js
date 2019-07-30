export default {
    state: () => ({
        categoryList: [],
        postList: [],
        cateId: '',
        page: 1,
        hasNext: false,
        loading: false,
        articleAlias: '',
        article: null
    }),

    mutations: {
        setData(state, data) {
            state[data.key] = data.value;
        },

        appendData(state, data) {
            state[data.key] = [...state[data.key], ...data.value];
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
                key: 'categoryList',
                value: result
            });
        },

        async getPosts({ commit, state }) {
            let postList = [];
            let hasNext = false;
            commit('setData', {
                key: 'loading',
                value: true
            });
            try {
                const { data } = await this.$axios.$get('/api/posts', {
                    params: {
                        cateId: state.cateId,
                        pageIndex: state.page
                    }
                });
                postList = data.postList;
                hasNext = data.hasNext;
            } catch (err) {
                console.error(err);
            }
            commit('appendData', {
                key: 'postList',
                value: postList
            });
            commit('setData', {
                key: 'hasNext',
                value: hasNext
            });
            commit('setData', {
                key: 'loading',
                value: false
            });
        },

        async getArticle ({ commit, state }) {
            let article = null;
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
                key: 'article',
                value: article
            });
        }
    }
}
