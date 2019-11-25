<template>
  <div>
    <div class="auth-panel">
      <h2>后台登录</h2>
      <a-input-password size="large" placeholder="请输入密码" />
      <a-button size="large">登录</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "PageLogin",
  layout: "auth"
});
</script>

<style>
.auth-panel {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 30px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.09);
}
</style>