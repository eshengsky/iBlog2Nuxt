<template>
  <div class="guestbook-wrap">
    <article class="list-wrap">
      <comment-list :comments="guestbook" :from="1"></comment-list>
    </article>
  </div>
</template>
<script>
import { mapState } from "vuex";
import CommentList from "~/components/CommentList.vue";
export default {
  components: {
    CommentList
  },
  async asyncData({ req, store }) {
    store.commit("setData", {
      user: req.user
    });
    await store.dispatch("getGuestbook");
  },
  computed: mapState({
    guestbook: state => state.guestbook
  })
};
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
  padding: 0 30px 40px;
  background: #fff;
  border-color: #e7eaec;
  border-style: solid solid none;
  border-width: 1px 0;
  transition: width 0.3s;
  min-height: 400px;
}
</style>