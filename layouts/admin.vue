<template>
  <a-locale-provider :locale="zh_CN">
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-sider :trigger="null" collapsible v-model="collapsed" class="layout-sider">
        <div class="logo" />
        <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['article-manage']">
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
      <a-layout :style="{ marginLeft: '200px' }">
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="()=> collapsed = !collapsed"
          />
        </a-layout-header>
        <a-layout-content
          :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '80vh' }"
        >
          <nuxt />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-locale-provider>
</template>
<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  data() {
    return {
      collapsed: false,
      zh_CN
    };
  }
};
</script>
<style>
#components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}

.layout-sider {
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
}
</style>