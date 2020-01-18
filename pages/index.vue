<template>
  <div>
    <category-list :categories="categories" />
    <post-list :category="category" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import CategoryList from '~/components/CategoryList.vue';
import PostList from '~/components/PostList.vue';
import { allCategoryItem } from '@/server/models/category';
import { IResp } from '@/server/types';
export default Vue.extend({
    components: {
        CategoryList,
        PostList
    },

    async asyncData ({ $axios, params, error }: any) {
        const { code, data }: IResp = await $axios.$get('/api/categories');
        if (code === 1) {
            data.unshift(allCategoryItem);
            const alias = params.category || '';
            const category = data.find(item => item.alias === alias);
            if (category) {
                return {
                    categories: data,
                    category
                };
            }
            error({
                statusCode: 404,
                message: '未找到该页面'
            });
        } else {
            error({
                statusCode: 500,
                message: '内部服务器错误'
            });
        }
    },

    data () {
        return {
            categories: [],
            category: null
        };
    }
});
</script>
