<template>
  <div class="widget-container">
    <div class="widget-header">热门标签</div>
    <div class="widget-body">
      <a-spin :spinning="spinning" />
      <nuxt-link
        class="pop-label"
        :to="`/search?tag=${encodeURI(item._id)}`"
        v-for="(item, index) in list"
        :key="index"
      >{{ item._id }}</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IResp } from "@/server/types";
export default Vue.extend({
  data() {
    return {
      list: [],
      spinning: false
    };
  },
  async created() {
    this.spinning = true;
    const { code, data }: IResp = await this.$axios.$get("/api/popLabels");
    this.list = data.labels;
    this.spinning = false;
  }
});
</script>

<style>
.pop-label {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #777;
  border-radius: 50px;
  background-color: #f7f7f7;
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
  padding: 3px 14px;
  margin-right: 7px;
  margin-bottom: 10px;
}

.pop-label:hover {
  color: #fff;
  background-color: #72c02c;
}
</style>
