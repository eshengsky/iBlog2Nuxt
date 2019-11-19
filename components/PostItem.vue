<template>
  <div class="blog-item">
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
        @click="() => (drawer = true)"
      ></a>
      <h4>
        <a
          :title="post.title"
          :href="`/blog/${post.category.alias}/${post.alias}`"
          >{{ post.title }}</a
        >
      </h4>
    </template>
    <span title="文章分类">
      <font-awesome-icon :icon="['fas', 'map-signs']"></font-awesome-icon>
      <nuxt-link :to="`/blog/${post.category.alias}`">{{
        post.category.cateName
      }}</nuxt-link>
    </span>
    <span title="发布时间" style="margin-left: 20px;">
      <font-awesome-icon :icon="['far', 'clock']"></font-awesome-icon>
      {{ post.publishDate }}
    </span>
    <p>{{ post.summary }}</p>
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
export default Vue.extend({
  props: {
    post: {
      type: Object,
      default() {
        return {
          category: {}
        };
      }
    }
  },
  data() {
    return {
      drawer: false
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
  margin-top: 10px;
  margin-bottom: 10px;
}

.blog-item h4 a {
  display: inline-block;
  position: relative;
  z-index: 2;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  max-width: 100%;
  color: #444;
}

.blog-item h4 a:hover {
  color: #2d8cf0;
}

.blog-item p {
  margin-top: 20px;
}

.blog-item p,
.blog-item span,
.blog-item a {
  color: #555;
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
</style>
