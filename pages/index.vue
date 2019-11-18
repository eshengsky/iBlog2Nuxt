<template>
  <div>
    <category-list :categories="categories"></category-list>
    <post-list :categories="categories"></post-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CategoryList from "~/components/CategoryList.vue";
import PostList from "~/components/PostList.vue";
export default Vue.extend({
  components: {
    CategoryList,
    PostList
  },

  data() {
    return {
      categories: []
    };
  },

  async asyncData({ $axios, params, error }: any) {
    const { code, data } = await $axios.$get("/api/categories");
    if (code === 1) {
      const category = params.category || "";
      if (data.some(item => item.alias === category)) {
        return { categories: data };
      }
      error({
        statusCode: 404,
        message: "未找到该页面"
      });
    } else {
      error({
        statusCode: 500,
        message: "内部服务器错误"
      });
    }
  }
});
</script>
