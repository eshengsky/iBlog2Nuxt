<template>
  <div class="widget-container">
    <div class="widget-header">热门文章</div>
    <div class="widget-body">
      <ul>
        <li v-for="(item, index) in list" :key="index">
          <a class="pop-article-title" :href="articleUrl(item)" :title="item.title">{{ item.title }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IPost } from "@/server/models/post";
import { IResp } from "@/server/types";
export default Vue.extend({
  data() {
    return {
      list: [] as Array<IPost>
    };
  },
  async created() {
    const { code, data }: IResp = await this.$axios.$get("/api/popArticles");
    this.list = data.articles;
  },
  methods: {
    articleUrl(item: IPost) {
      if (!item.isLocal) {
        return item.url;
      }
      return `/blog/${item.category.alias}/${item.alias}`;
    }
  }
});
</script>

<style>
.pop-article-title {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  max-width: 100%;
}
</style>