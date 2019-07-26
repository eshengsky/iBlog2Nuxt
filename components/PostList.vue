<template>
  <div class="post-wrap">
    <div>TODO</div>
    <ul class="post-list" v-if="posts.length > 0">
      <li v-for="item in posts" :key="item._id">
        <post-item :post="item"></post-item>
      </li>
    </ul>
    <div v-else>暂无数据</div>

    <el-button class="btn-load" @click="loadNext" v-if="posts.length > 0 && hasNext" :loading="loading">下一页</el-button>
    <div class="no-more" v-if="posts.length > 0 && !hasNext">没有更多数据</div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PostItem from "~/components/PostItem.vue";
export default {
  scrollToTop: true,
  components: {
    PostItem
  },
  mounted: function() {
    this.$store.commit('setData', {
      key: 'postList',
      value: []
    });
    const category = this.$route.params.category || '';
    const findOne = this.$store.state.categoryList.find(
      item => item.alias === category
    );
    if (findOne) {
      this.$store.commit('setData', {
        key: 'page',
        value: 1
      });
      this.$store.commit('setData', {
        key: 'cateId',
        value: findOne._id
      });
      this.$store.dispatch('getPosts');
    }
  },
  computed: mapState({
    posts: state => state.postList,
    hasNext: state => state.hasNext,
    loading: state => state.loading
  }),
  methods: {
    loadNext() {
      this.$store.commit('setData', {
        key: 'page',
        value: this.$store.state.page + 1
      });
      this.$store.dispatch('getPosts');
    }
  }
};
</script>
<style>
.post-wrap {
  padding: 77px 0 0 310px;
}

.btn-load {
  width: 100%;
}
</style>