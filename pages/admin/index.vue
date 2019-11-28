<template>
  <div class="admin-index">
    <div class="page-header">数据统计</div>
    <div class="page-body"></div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "PageAdminIndex",
  layout: "admin",
  data() {
    return {
      commentsStats: {},
      guestbookStats: {},
      postsStats: {},
      commentsAndGuestbookStats: {}
    };
  },
  async create() {
    const stats = await Promise.all([
      this.$axios.$get("/admin/api/commentsStats"),
      this.$axios.$get("/admin/api/guestbookStats"),
      this.$axios.$get("/admin/api/postsStats"),
      this.$axios.$get("/admin/api/commentsAndGuestbookStats")
    ]);
    this.commentsStats = stats[0];
    this.guestbookStats = stats[1];
    this.postsStats = stats[2];
    this.commentsAndGuestbookStats = stats[3];
  }
});
</script>

<style></style>
