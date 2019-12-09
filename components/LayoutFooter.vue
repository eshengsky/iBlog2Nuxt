<template>
  <div class="layout-footer">
    Copyright ©{{ year }} Powered by
    <a
      href="https://github.com/eshengsky/iBlog2"
      target="_blank"
    >iBlog2</a>
    <template v-if="showLogin">
      |
      <nuxt-link to="/admin">
        后台管理
      </nuxt-link>
    </template>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
export default Vue.extend({
    props: {
        showLogin: {
            type: Boolean,
            default: false
        } as PropOptions<boolean>
    },
    data () {
        return {
            year: new Date().getFullYear()
        };
    }
});
</script>

<style>
.layout-footer {
  text-align: center;
  color: #888;
  user-select: none;
  padding: 24px 0;
}
</style>
