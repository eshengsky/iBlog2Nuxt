<template>
  <div class="article-content" v-html="content">
  </div>
</template>
<script>
import { mapState } from "vuex";
import "highlight.js/styles/tomorrow-night.css";
export default {
  props: ["content"]
};
</script>
