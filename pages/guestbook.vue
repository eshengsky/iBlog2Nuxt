<template>
  <div class="guestbook-wrap">
    <article class="list-wrap">
      <comment-list :comments="guestbook" :from="1"></comment-list>
    </article>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import CommentList from "@/components/CommentList.vue";
import "highlight.js/styles/tomorrow.css";
export default Vue.extend({
  components: {
    CommentList
  },
  data() {
    return {
      guestbook: []
    }
  },
  async asyncData({ $axios }) {
    const { code, data } = await $axios.$get("/api/guestbook");
    if (code === 1) {
      return {
        guestbook: data.guestbook
      };
    }
  }
});
</script>
<style scoped>
.guestbook-wrap {
  background: #f3f3f4;
  min-height: 100vh;
  padding-top: 30px;
}
.list-wrap {
  max-width: 1012px;
  margin: 0 auto 20px;
  padding: 0 30px 10px;
  background: #fff;
  border-color: #e7eaec;
  border-style: solid solid none;
  border-width: 1px 0;
  transition: width 0.3s;
  min-height: 400px;
}
</style>
