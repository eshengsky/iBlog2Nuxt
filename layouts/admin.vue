<template>
  <a-locale-provider :locale="zh_CN">
    <a-layout class="layout-admin">
      <a-layout-sider
        :trigger="null"
        breakpoint="lg"
        collapsible
        v-model="collapsed"
        class="layout-sider"
      >
        <div class="logo" />
        <a-menu theme="dark" mode="inline" :defaultSelectedKeys="[currentKey]">
          <a-menu-item key="index" title="数据统计">
            <nuxt-link to="/admin">
              <a-icon type="video-camera" />
              <span>数据统计</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="article-manage" title="文章管理">
            <nuxt-link to="/admin/article-manage">
              <a-icon type="video-camera" />
              <span>文章管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="category-manage" title="分类管理">
            <nuxt-link to="/admin/category-manage">
              <a-icon type="user" />
              <span>分类管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="comment-manage" title="评论管理">
            <nuxt-link to="/admin/comment-manage">
              <a-icon type="user" />
              <span>评论管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="guestbook-manage" title="留言管理">
            <nuxt-link to="/admin/guestbook-manage">
              <a-icon type="user" />
              <span>留言管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="system-settings" title="系统设置">
            <nuxt-link to="/admin/system-settings">
              <a-icon type="user" />
              <span>系统设置</span>
            </nuxt-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout :style="{ marginLeft }" style="transition: all .2s;">
        <a-layout-header class="layout-header">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
        </a-layout-header>
        <a-layout-content>
          <nuxt />
        </a-layout-content>
        <layout-footer></layout-footer>
      </a-layout>
    </a-layout>
  </a-locale-provider>
</template>
<script lang="ts">
import Vue from "vue";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import LayoutFooter from "@/components/LayoutFooter.vue";
export default Vue.extend({
  middleware: 'auth',
  components: {
    LayoutFooter
  },
  data() {
    return {
      collapsed: false,
      year: new Date().getFullYear(),
      zh_CN
    };
  },
  computed: {
    marginLeft(): string {
      return this.collapsed ? "80px" : "200px";
    },
    currentKey(): string {
      let path = this.$route.path.replace("/admin", "");
      if (path.substring(0, 1) === "/") {
        path = path.substring(1);
      }
      if (path.substring(path.length - 1) === "/") {
        path = path.substring(0, path.length - 1);
      }
      if (!path) {
        return "index";
      }
      if (path === "article-edit") {
        return "article-manage";
      }
      return path;
    }
  }
});
</script>
<style>
.layout-admin .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.layout-admin .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.layout-admin .trigger:hover {
  color: #1890ff;
}

.layout-sider {
  overflow-y: auto;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
}

.layout-header {
  background: #f3f3f4;
  padding: 0;
  border-bottom: 1px solid #e7eaec;
}

.page-header {
  background: #fff;
  font-size: 20px;
  font-weight: 100;
  padding: 16px 25px;
  border-bottom: 1px solid #e7eaec;
  user-select: none;
}

.page-body {
  margin: 25px 25px 0;
  padding: 25px;
  background: rgb(255, 255, 255);
  min-height: 80vh;
}
</style>
