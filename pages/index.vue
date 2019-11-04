<template>
  <div>
    <category-list :categories="categories"></category-list>
    <no-ssr>
      <post-list :categories="categories"></post-list>
    </no-ssr>
  </div>
</template>

<script>
import CategoryList from "~/components/CategoryList.vue";
import PostList from "~/components/PostList.vue";
export default {
  components: {
    CategoryList,
    PostList
  },

  data() {
    return {
      categories: []
    };
  },

  async asyncData({ $axios, params, error }) {
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
};
</script>
