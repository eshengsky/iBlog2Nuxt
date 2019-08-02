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
      <a class="preview-link" title="点击预览" @click="preview"></a>
      <h4>
        <a
          :title="post.title"
          :href="`/blog/${post.category.alias}/${post.alias}`"
          target="_blank"
        >{{ post.title }}</a>
      </h4>
    </template>
    <span title="文章分类">
      <font-awesome-icon :icon="['fas', 'map-signs']"></font-awesome-icon>
      <nuxt-link :to="`/blog/${post.category.alias}`">{{ post.category.cateName }}</nuxt-link>
    </span>
    <span title="发布时间">
      <font-awesome-icon :icon="['far', 'clock']"></font-awesome-icon>
      {{ post.publishDate }}
    </span>
    <p>{{ post.summary }}</p>
  </div>
</template>
<script>
export default {
  props: ["post"],
  methods: {
    preview() {
      this.$store.commit("setData", {
        key: "article",
        value: this.post
      });
      this.$store.commit("setData", {
        key: "drawer",
        value: true
      });
    }
  }
};
</script>
<style scoped>
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
}

.blog-item p,
.blog-item span {
  color: #777;
}
</style>

