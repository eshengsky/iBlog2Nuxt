<template>
  <div class="blog-item">
    <template v-if="!post.isLocal">
      <h4>
        <a :title="post.title" :href="post.url" target="_blank">
          <i class="fa fa-link"></i> {{ post.title }}
        </a>
      </h4>
      <span title="文章分类">
        <i class="fa fa-map-signs"></i>
        <nuxt-link :to="`/blog/${post.category.alias}`">{{ post.cateName }}</nuxt-link>
      </span>
      <span title="发布时间">
        <i class="fa fa-clock-o"></i>
        {{ post.publishDate }}
      </span>
      <a
        :title="post.host"
        target="_blank"
        :href="post.url.substring(0, post.url.indexOf('://') + 3) + post.host"
      >
        <i class="fa fa-globe-americas"></i>
        {{ post.host }}
      </a>
      <p>{{ post.summary }}</p>
    </template>
    <template v-else>
      <a class="preview-link" title="点击预览"></a>
      <h4>
        <a :title="post.title" :href="`/blog/${post.category.alias}/${post.alias}`" target="_blank">
          {{ post.title }}
        </a>
      </h4>
      <span title="文章分类">
        <i class="fa fa-map-signs"></i>
        <nuxt-link :to="`/blog/${post.category.alias}`">{{ post.category.cateName }}</nuxt-link>
      </span>
      <span title="发布时间">
        <i class="fa fa-clock-o"></i> {{ post.publishDate }}
      </span>
      <p>{{ post.summary }}</p>
    </template>
  </div>
</template>
<script>
export default {
  props: ["post"]
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
    position: relative;
    z-index: 2;
    line-height: 1.3;
    max-height: 47px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
}

.blog-item p,
.blog-item span {
    color: #777;
}
</style>

