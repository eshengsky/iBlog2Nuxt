<template>
  <div>
    <div class="auth-panel">
      <h2 class="auth-title">后台登录</h2>
      <p class="auth-desc">Admin</p>
      <div class="auth-input">
        <a-input-password
          size="large"
          placeholder="请输入密码"
          ref="input"
          v-model="pwd"
          @keyup.enter="login"
        />
      </div>
      <a-button type="primary" :block="true" size="large" @click="login"
        >登录</a-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import md5 from "blueimp-md5";
export default Vue.extend({
  name: "PageLogin",
  layout: "auth",
  async asyncData({ $axios, redirect }) {
    const { code, data } = await $axios.$get("/api/auth/exists");
    if (code === 1 && !data.exists) {
      // 临时重定向
      redirect(302, "/auth/init-account");
    }
  },
  data() {
    return {
      pwd: ""
    };
  },
  mounted() {
    (this.$refs.input as any).$children[0].focus();
  },
  methods: {
    login(this: any) {
      if (!this.pwd) {
        (this.$refs.input as any).$children[0].focus();
        return;
      }
      this.$auth
        .loginWith("local", {
          data: {
            password: md5(this.pwd)
          }
        })
        .catch(err => {
          this.$message.error("密码不正确！");
        });
    }
  }
});
</script>

<style>
.auth-panel {
  max-width: 370px;
  margin: 13vh auto 0;
  padding: 50px 40px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.09);
}

.auth-title {
  text-align: center;
}

.auth-desc {
  color: #777;
  text-align: center;
}

.auth-input {
  margin: 60px 0 20px;
}
</style>
