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
<style>
</style>