<template>
  <div class="guestbook-wrap">
    <article class="list-wrap">
      <comment-list
        :comments="comments"
        :page="page"
        :hasNext="hasNext"
        :loading="loading"
        :total="total"
        :from="1"
        @loadNext="loadNext"
      ></comment-list>
    </article>
  </div>
</template>
<script>
import { mapState } from "vuex";
import CommentList from "~/components/CommentList.vue";
import "highlight.js/styles/tomorrow.css";
export default {
  components: {
    CommentList
  },
  created() {
    this.$store.commit("guestbook/setData", {
      loading: true
    });
  },
  mounted() {
    this.$store.dispatch("guestbook/getGuestbook");
  },
  computed: mapState({
    comments: state => state.guestbook.commentList,
    page: state => state.guestbook.page,
    total: state => state.guestbook.total,
    hasNext: state => state.guestbook.hasNext,
    loading: state => state.guestbook.loading
  }),
  methods: {
    // 加载下一页
    loadNext() {
      this.$store.commit("guestbook/setData", {
        page: this.page + 1
      });
      this.$store.dispatch("guestbook/getGuestbook");
    }
  }
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