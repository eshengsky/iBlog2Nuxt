<template>
  <div>
    <a-row class="flex-center">
      <a-col :sm="16" :lg="10">
        <div class="auth-panel">
          <h2>后台登录</h2>
          <div class="auth-input">
            <a-input-password
              size="large"
              placeholder="请输入密码"
              ref="input"
              v-model="pwd"
              @keyup.enter="login"
            />
            <a-button type="primary" size="large" @click="login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import md5 from "blueimp-md5";
export default Vue.extend({
  name: "PageLogin",
  layout: "auth",
  async asyncData({ $axios, redirect }) {
    const { code, data } = await $axios.$get('/auth/api/exists');
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
      this.$auth.loginWith('local', {
        data: {
          password: md5(this.pwd)
        }
      }).catch(() => {
        this.$message.error("密码不正确！");
      });
    }
  }
});
</script>

<style>
.flex-center {
  display: flex;
  justify-content: center;
  padding-top: 30vh;
}

.auth-panel {
  padding: 40px 30px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.09);
}

.auth-input {
  display: flex;
  margin-top: 30px;
}

.auth-input button {
  margin-left: 15px;
}
</style>
