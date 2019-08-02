<template>
  <div class="post-wrap">
    <div>TODO</div>
    <ul class="post-list" v-if="posts.length > 0">
      <li v-for="item in posts" :key="item._id">
        <post-item :post="item"></post-item>
      </li>
    </ul>
    <div v-else>暂无数据</div>

    <el-button
      class="btn-load"
      @click="loadNext"
      v-if="posts.length > 0 && hasNext"
      :loading="loading"
    >下一页</el-button>
    <div class="no-more" v-if="posts.length > 0 && !hasNext">没有更多数据</div>

    <el-drawer
      :append-to-body="true"
      :title="article.title"
      :visible="drawer"
      direction="rtl"
      size="60%"
      :show-close="false"
      @open="open"
      @close="close"
    >
      <div class="preview-wrap">
        <div class="article-content" v-html="article.html"></div>
        <footer class="preview-footer">123</footer>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PostItem from "~/components/PostItem.vue";
import "highlight.js/styles/tomorrow.css";
export default {
  scrollToTop: true,
  components: {
    PostItem
  },
  mounted: function() {
    this.$store.commit("setData", {
      key: "postList",
      value: []
    });
    const category = this.$route.params.category || "";
    const findOne = this.$store.state.categoryList.find(
      item => item.alias === category
    );
    if (findOne) {
      this.$store.commit("setData", {
        key: "page",
        value: 1
      });
      this.$store.commit("setData", {
        key: "cateId",
        value: findOne._id
      });
      this.$store.dispatch("getPosts");
    }
  },
  computed: mapState({
    page: state => state.page,
    posts: state => state.postList,
    hasNext: state => state.hasNext,
    loading: state => state.loading,
    drawer: state => state.drawer,
    article: state => state.article
  }),
  methods: {
    loadNext() {
      this.$store.commit("setData", {
        key: "page",
        value: this.page + 1
      });
      this.$store.dispatch("getPosts");
    },
    open() {
      this.$store.commit("setData", {
        key: "drawer",
        value: true
      });
    },
    close() {
      this.$store.commit("setData", {
        key: "drawer",
        value: false
      });
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

.el-drawer__header {
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 20px;
  margin-bottom: 0;
  font-size: 18px;
  color: #333;
}

.el-drawer__body {
  padding: 0 30px;
  overflow: auto;
}

.preview-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-content {
  flex: 1;
}
</style>