<template>
  <div class="guestbook-wrap">
    <article class="list-wrap">
      <comment-list :from="1" />
    </article>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import CommentList from '@/components/CommentList.vue';
import 'highlight.js/styles/tomorrow.css';
export default Vue.extend({
    components: {
        CommentList
    }
});
</script>
<style scoped>
.guestbook-wrap {
  background: #f3f3f4;
  min-height: 85vh;
  padding-top: 20px;
}
.list-wrap {
  max-width: 1012px;
  margin: 0 auto 20px;
  padding: 0 40px 40px;
}
</style>
