<template>
  <div class="article-content" v-html="content">
  </div>
</template>
<script>
import { mapState } from "vuex";
import "highlight.js/styles/tomorrow.css";
export default {
  props: ["content"]
};
</script>
<style>
.article-content {
  font-family: Consolas, "Courier New", monospace;
}

pre.hljs {
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.55) 0px 2px 13px;
}

pre code {
  font-size: 14px;
  line-height: 19px;
}

.pre-header {
  display: flex;
  justify-content: space-between;
  height: 36px;
}

.pre-header-left div {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  display: inline-block;
}

.pre-header-left div:nth-of-type(1) {
  background: rgb(255, 95, 86);
}

.pre-header-left div:nth-of-type(2) {
  background: rgb(255, 189, 46);
}

.pre-header-left div:nth-of-type(3) {
  background: rgb(39, 201, 63);
}

.pre-header-right {
  font-size: 12px;
  color: #777;
  -webkit-user-select: none;
  user-select: none;
}
</style>
