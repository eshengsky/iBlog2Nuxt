<template>
  <div class="category-wrap">
    <div class="category-title">文章分类</div>
    <div class="category-split"></div>
    <ul class="category-list">
      <li v-for="item in categories" :key="item._id">
        <nuxt-link :to="item.alias ? `/blog/${item.alias}` : '/'" exact active-class="active">
          <img :src="item.img" />
          <span>{{ item.cateName }}</span>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
<script>
import Vue from "vue";
export default Vue.extend({
  props: {
    categories: {
      type: Array,
      default() {
        return [];
      }
    }
  }
});
</script>
<style scoped>
.category-wrap {
  padding: 30px 0 0 15px;
  width: 260px;
  top: 70px;
  bottom: 0;
  position: fixed;
  z-index: 1;
}

.category-title {
  border: 1px solid #e7eaec;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  padding-left: 15px;
  background: #fff;
}

.category-split {
  height: 20px;
  border-left: 1px solid #e7eaec;
  border-right: 1px solid #e7eaec;
  background: #fff;
}

.category-list {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin-left: 15px;
  top: 110px;
  background: #fff;
  border-left: 1px solid #e7eaec;
  border-right: 1px solid #e7eaec;
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
</style>
