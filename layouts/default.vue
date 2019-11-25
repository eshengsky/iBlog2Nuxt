<template>
  <a-locale-provider :locale="zh_CN">
    <div class="container">
      <div class="navbar">
        <div class="navbar-header">
          <nuxt-link class="navbar-brand" to="/">
            <img :src="settings.blogLogo" />
            <h4>
              {{ settings.blogName }}
              <p v-if="settings.blogSlogan">{{ settings.blogSlogan }}</p>
            </h4>
          </nuxt-link>
        </div>
        <div class="navbar-collapse">
          <ul>
            <li :class="{ 'blog-active': $route.path === '/' || $route.path.startsWith('/blog') }">
              <nuxt-link to="/">
                <font-awesome-icon :icon="['fas', 'pen-nib']"></font-awesome-icon>博客
              </nuxt-link>
              <div class="nav-line"></div>
            </li>
            <li :class="{ 'guestbook-active': $route.path === '/guestbook' }">
              <nuxt-link to="/guestbook">
                <font-awesome-icon :icon="['fas', 'comment-dots']"></font-awesome-icon>留言
              </nuxt-link>
              <div class="nav-line"></div>
            </li>
            <li :class="{ 'profile-active': $route.path === '/profile' }">
              <nuxt-link to="/profile">
                <font-awesome-icon :icon="['fas', 'user']"></font-awesome-icon>关于
              </nuxt-link>
              <div class="nav-line"></div>
            </li>
          </ul>
        </div>
      </div>
      <nuxt />
      <layout-footer :showLogin="true"></layout-footer>
    </div>
  </a-locale-provider>
</template>
<script lang="ts">
import Vue from "vue";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import LayoutFooter from "@/components/LayoutFooter.vue";
export default Vue.extend({
  components: {
    LayoutFooter
  },
  data() {
    return {
      year: new Date().getFullYear(),
      settings: this.$store.state.settings,
      zh_CN
    };
  }
});
</script>
<style>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 70px;
  background: #fff;
  border-bottom: 1px solid rgba(234, 234, 234, 0.8);
  z-index: 3;
  box-shadow: 0 0 3px rgba(234, 234, 234, 0.8);
}

.navbar .navbar-header {
  padding: 0 15px;
}

.navbar .navbar-brand {
  display: flex;
  align-items: center;
  height: 100%;
  color: #2b2b2b;
  font-size: 18px;
  font-family: -apple-system, BlinkMacSystemFont, "Arial", "Segoe UI",
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue",
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
}

.navbar .navbar-brand img {
  height: 46px;
  margin-right: 5px;
}

.navbar .navbar-brand h4 {
  margin: 0;
}

.navbar .navbar-brand h4 p {
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
}

.navbar-collapse ul {
  display: flex;
}

.navbar-collapse li {
  position: relative;
}

.navbar-collapse a {
  display: block;
  font-size: 16px;
  line-height: 69px;
  padding: 0 13px;
  border-bottom: 1px solid transparent;
  color: #333;
  -ms-opacity: 0.8;
  opacity: 0.8;
  letter-spacing: 1px;
}

.navbar-collapse a:hover {
  -ms-opacity: 1;
  opacity: 1;
}

.navbar-collapse svg {
  margin-right: 4px;
}

.navbar-collapse li.blog-active a {
  color: #ff6600;
  opacity: 1;
}

.navbar-collapse li.blog-active .nav-line {
  display: block;
  background: #ff6600cc;
}

.navbar-collapse li.guestbook-active a {
  color: #d243ff;
  opacity: 1;
}

.navbar-collapse li.guestbook-active .nav-line {
  display: block;
  background: #d243ffcc;
}

.navbar-collapse li.profile-active a {
  color: #01b7ee;
  opacity: 1;
}

.navbar-collapse li.profile-active .nav-line {
  display: block;
  background: #01b7eecc;
}

.nav-line {
  display: none;
  position: absolute;
  height: 3px;
  border-radius: 5px;
  bottom: 0;
  right: 14px;
  width: 30px;
  -webkit-animation: fadeInLeft 1s;
  animation: fadeInLeft 1s;
}

@-webkit-keyframes fadeInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-60%, 0, 0);
    transform: translate3d(-60%, 0, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(-60%, 0, 0);
    transform: translate3d(-60%, 0, 0);
  }

  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
</style>
