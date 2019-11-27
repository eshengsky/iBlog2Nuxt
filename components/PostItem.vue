<template>
  <div class="blog-item">
    <div class="item-header">{{ publishDate }}</div>
    <template v-if="!post.isLocal">
      <h4>
        <a :title="post.title" :href="post.url" target="_blank">
          <i class="fa fa-link"></i>
          {{ post.title }}
        </a>
      </h4>
    </template>
    <template v-else>
      <a
        class="preview-link"
        title="点击预览"
        v-if="settings.enablePreview"
        @click="() => (drawer = true)"
      ></a>
      <h4>
        <nuxt-link :to="`/blog/${post.category.alias}/${post.alias}`" :title="post.title">{{ post.title }}</nuxt-link>
      </h4>
    </template>
    <div class="item-footer">
      <span>
        <font-awesome-icon :icon="['fas', 'map-signs']"></font-awesome-icon>
        {{ post.category.cateName }}
      </span>
      <span>
        <font-awesome-icon :icon="['far', 'eye']"></font-awesome-icon>
        {{ post.viewCount }}
      </span>
      <span>
        <font-awesome-icon :icon="['far', 'comments']"></font-awesome-icon>
        {{ post.comments.length }}
      </span>
    </div>

    <div class="hr-line-dashed"></div>
    <a-drawer
      :title="post.title"
      :visible="drawer"
      width="66.66%"
      :closable="false"
      @close="() => (drawer = false)"
    >
      <article class="preview-article" v-html="post.html"></article>
      <footer class="preview-footer">
        <a-button @click="() => (drawer = false)">关闭</a-button>
        <a-button
          type="primary"
          :href="`/blog/${post.category.alias}/${post.alias}`"
          target="_blank"
          >完整模式</a-button
        >
      </footer>
    </a-drawer>
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from "vue";
import moment from "moment";
export default Vue.extend({
  props: {
    post: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      settings: this.$store.state.settings,
      drawer: false,
      publishDate: moment(this.post.createTime).format("MM/DD, YYYY")
    };
  }
});
</script>
<style>
.blog-item {
  position: relative;
}

.preview-link {
  display: block;
  cursor: alias;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
}

.blog-item h4 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 12px;
}

.blog-item h4 a {
  color: #444;
  position: relative;
  display: -webkit-inline-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  word-break: break-all;
  -webkit-line-clamp: 2;
  z-index: 2;
  transition: color 0.5s ease-in-out;
  line-height: 1.4;
}

.blog-item h4 a:hover {
  color: #2d8cf0;
}

.blog-item .item-header {
  color: #777;
  margin-bottom: 5px;
  font-family: -apple-system, BlinkMacSystemFont, "Arial", "Segoe UI",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue",
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  font-size: 13px;
}

.blog-item .item-footer {
  color: #777;
}

.hr-line-dashed {
  background-color: #fff;
  border-top: 1px dashed #e7eaec;
  color: #fff;
  height: 1px;
  margin: 20px 0;
}

.ant-drawer-title {
  font-size: 18px;
  line-height: 18px;
  padding: 0 10px;
  color: #333;
}

.preview-article {
  padding-bottom: 46px;
}

.preview-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}

.blog-item .item-footer span {
  margin-right: 8px;
}
</style>
