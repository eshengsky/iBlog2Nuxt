<template>
  <div class="category-wrap">
    <div class="category-top">文章分类</div>
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
<script>
import { mapState } from 'vuex';
export default {
  computed: mapState({
    categories: state => state.categoryList
  })
};
</script>
<style scoped>
.category-wrap {
    background: #f3f3f4;
    padding: 30px 0 0 15px;
    width: 260px;
    top: 70px;
    bottom: 0;
    position: fixed;
    z-index: 1;
}

.category-top {
    border: 1px solid #e7eaec;
    height: 60px;
    font-size: 16px;
    padding-top: 20px;
    padding-left: 15px;
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
    border-bottom: 1px solid transparent;
    border-top: 1px solid transparent;
    font-size: 15px;
    height: 50px;
    position: relative;
    display: flex;
    align-items: center;
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
