const minLoadingTimeout = 1000;
export default {
    state: () => ({
        page: 1,
        total: 0,
        hasNext: false,
        loading: false,
        commentList: []
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
        async getGuestbook({ commit, state }) {
            const startTime = new Date();
            let commentList = [];
            let hasNext = false;
            let total = 0;
            commit('setData', {
                loading: true
            });
            try {
                const { data } = await this.$axios.$get('/api/guestbook', {
                    params: {
                        pageIndex: state.page
                    }
                });
                commentList = data.guestbook;
                hasNext = data.hasNext;
                total = data.total;
            } catch (err) {
                console.error(err);
            }

            // loading 时间过短体验也不好，这里设置一个最少 loading 时间
            const duration = new Date() - startTime;
            const timeout = duration > minLoadingTimeout ? 0 : (minLoadingTimeout - duration);
            setTimeout(() => {
                commit('appendData', {
                    commentList
                });
                commit('setData', {
                    hasNext,
                    total,
                    loading: false
                });
            }, timeout);
        },

        async saveGuestbook({ state }, payload) {
            return await this.$axios.$post('/api/saveGuestbook', {
                pathId: payload.pathId,
                content: payload.content
            });
        }
    }
}
