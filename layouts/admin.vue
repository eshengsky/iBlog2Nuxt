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
        <a-menu theme="dark" mode="inline" :selectedKeys="[currentKey]">
          <a-menu-item key="index" title="数据统计">
            <nuxt-link to="/admin">
              <font-awesome-icon :icon="['fas', 'chart-line']" fixed-width></font-awesome-icon>
              <span>数据统计</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="article-manage" title="文章管理">
            <nuxt-link to="/admin/article-manage">
              <font-awesome-icon :icon="['fas', 'pen-nib']" fixed-width></font-awesome-icon>
              <span>文章管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="category-manage" title="分类管理">
            <nuxt-link to="/admin/category-manage">
              <font-awesome-icon :icon="['fas', 'map-signs']" fixed-width></font-awesome-icon>
              <span>分类管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="comment-manage" title="评论管理">
            <nuxt-link to="/admin/comment-manage">
              <font-awesome-icon :icon="['fas', 'comments']" fixed-width></font-awesome-icon>
              <span>评论管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="guestbook-manage" title="留言管理">
            <nuxt-link to="/admin/guestbook-manage">
              <font-awesome-icon :icon="['fas', 'comment-dots']" fixed-width></font-awesome-icon>
              <span>留言管理</span>
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="system-settings" title="系统设置">
            <nuxt-link to="/admin/system-settings">
              <font-awesome-icon :icon="['fas', 'cogs']" fixed-width></font-awesome-icon>
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
            @click="toggleCollapsed"
          />
          <div class="auth-actions">
            <a-dropdown placement="bottomRight">
              <span>
                Admin
                <a-icon type="down" />
              </span>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="/auth/change-password">
                    <font-awesome-icon :icon="['fas', 'key']" style="margin-right: 5px;"></font-awesome-icon>修改密码
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="logout" title="退出登录">
                    <font-awesome-icon :icon="['fas', 'sign-out-alt']" style="margin-right: 5px;"></font-awesome-icon>退出登录
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
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
import moment from "moment";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import LayoutFooter from "@/components/LayoutFooter.vue";
import { CombinedVueInstance, VueConstructor } from "vue/types/vue";
Vue.filter("toDate", (date: string) => {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
});
export default Vue.extend({
  middleware: "auth",
  components: {
    LayoutFooter
  },
  data() {
    return {
      collapsed: false,
      year: new Date().getFullYear(),
      zh_CN,
      currentKey: ""
    };
  },
  computed: {
    marginLeft(): string {
      return this.collapsed ? "80px" : "200px";
    }
  },
  created() {
    this.currentKey = this.getCurrentKey(this.$route.path);
    this.$router.afterEach((to, from) => {
      this.currentKey = this.getCurrentKey(to.path);
    });
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
      this.$bus.$emit("changeLayout");
    },
    logout(this: any) {
      this.$auth.logout("local");
    },
    getCurrentKey(originalPath) {
      let path = originalPath.replace("/admin", "");
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
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
  background: #f3f3f4;
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
  border-radius: 5px;
}

.auth-actions {
  color: #777;
  font-weight: 500;
}

.auth-actions span {
  cursor: pointer;
  margin-right: 4px;
}

.auth-actions a {
  color: #777;
}

.filter-wrap {
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 20px;
}

.ant-menu-item svg {
  margin-right: 8px;
}
</style>
