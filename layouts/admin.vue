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
          <a-menu-item key="article-manage" title="文章管理">
            <a href="/admin/article-manage">
              <a-icon type="video-camera" />
              <span>文章管理</span>
            </a>
          </a-menu-item>
          <a-menu-item key="category-manage" title="分类管理">
            <a href="/admin/category-manage">
              <a-icon type="user" />
              <span>分类管理</span>
            </a>
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="upload" />
            <span>nav 3</span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout :style="{ marginLeft }" style="transition: all .2s;">
        <a-layout-header class="layout-header">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => collapsed = !collapsed"
          />
        </a-layout-header>
        <a-layout-content>
          <nuxt />
        </a-layout-content>
        <a-layout-footer class="layout-footer">iBlog2 ©{{year}} All Rights Reserved</a-layout-footer>
      </a-layout>
    </a-layout>
  </a-locale-provider>
</template>
<script lang="ts">
import Vue from "vue";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default Vue.extend({
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
      let path = this.$route.path.replace("/admin/", "");
      if (path.substring(path.length - 1) === "/") {
        path = path.substring(0, path.length - 1);
      }
      if (path === "article-edit") {
        path = "article-manage";
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
}

.page-body {
  margin: 25px 25px 0;
  padding: 25px;
  background: rgb(255, 255, 255);
  min-height: 80vh;
}

.layout-footer {
  text-align: center;
  color: #888;
  user-select: none;
}
</style>