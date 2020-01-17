<template>
  <div class="category-wrap">
    <div class="category-title">
      文章分类
    </div>
    <ul class="category-list">
      <li v-for="item in categories" :key="item._id">
        <nuxt-link :to="item.alias ? `/blog/${item.alias}` : '/'" exact active-class="active">
          <img :src="item.img">
          <span>{{ item.cateName }}</span>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue';
import { ICategory } from '@/server/models/category';
export default Vue.extend({
    props: {
        categories: {
            type: Array,
            default () {
                return [];
            }
        } as PropOptions<Array<ICategory>>
    }
});
</script>
<style scoped>
.category-wrap {
  width: 250px;
  top: 100px;
  bottom: 0;
  margin-left: 15px;
  position: fixed;
  z-index: 1;
  background: #fff;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  overflow: hidden;
}

.category-title {
  border-bottom: 1px solid #e7eaec;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  padding-left: 15px;
  margin-bottom: 20px;
  background: #fff;
}

.category-list li a {
  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top: 1px solid transparent;
  font-size: 15px;
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  color: #444;
}

.category-list li a:hover {
  color: #f60;
}

.category-list li a.active {
  background-color: #fff5ee;
  border-color: #f8d4bc;
  color: #f60;
}

.category-list li a img {
  width: 25px;
  height: 25px;
  position: absolute;
}

.category-list li a span {
  padding-left: 28px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

@media (max-width: 840px) {
  .category-wrap {
    display: none;
  }
}
</style>
