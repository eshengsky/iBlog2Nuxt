<template>
  <article class="content-wrap">
    <header class="article-title">
      <span>
        <font-awesome-icon :icon="['far', 'clock']"></font-awesome-icon>
        {{ article.createTime }}
      </span>
      <h1>{{ article.title }}</h1>
    </header>
    <main class="article-main">
      <div class="article-content" v-html="article.html"></div>
    </main>
    <div v-if="settings.showLicense" class="license-wrap">
      <span>【END】</span>
      <p>本文链接：{{ postLink }}</p>
      <p>
        <span>版权声明：本博客所有文章除声明转载外，均采用</span>
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/3.0/deed.zh"
          target="_blank"
          >CC BY-NC-SA 3.0</a
        >
        <span>许可协议。转载请注明来自</span>
        <a :href="website">{{ settings.blogName }}</a
        >。
      </p>
    </div>
    <div v-else class="end-wrap">
      <span>【END】</span>
    </div>
    <comment-list :from="2" :articleId="article._id"></comment-list>
    <aside class="menu-wrap" v-show="menuShow">
      <div class="menu-container">
        <div class="menu-title">文章目录</div>
        <a-anchor
          :affix="false"
          :showInkInFixed="true"
          :offsetTop="75"
          :bounds="10"
        >
          <a-anchor-link
            v-for="(item1, index1) in menus"
            :href="item1.href"
            :title="item1.title"
            :key="index1"
          >
            <a-anchor-link
              v-for="(item2, index2) in item1.subs"
              :href="item2.href"
              :title="item2.title"
              :key="index2"
            />
          </a-anchor-link>
        </a-anchor>
      </div>
    </aside>
  </article>
</template>
<script lang="ts">
import Vue from "vue";
import "highlight.js/styles/tomorrow.css";
import CommentList from "~/components/CommentList.vue";
interface IHeading3 {
  href: string;
  title: string;
}
interface IHeading2 extends IHeading3 {
  subs: Array<IHeading3>;
}
export default Vue.extend({
  components: {
    CommentList
  },
  data() {
    return {
      settings: this.$store.state.settings,
      article: {},
      menus: [] as Array<IHeading2>,
      menuShow: false
    };
  },
  computed: {
    postLink() {
      if (process.client) {
        return location.protocol + "//" + location.host + location.pathname;
      }
      return "";
    },
    website() {
      if (process.client) {
        return location.protocol + "//" + location.host;
      }
      return "";
    }
  },
  async asyncData({ $axios, params, error }) {
    const alias = params.article;
    const { code, data: article } = await $axios.$get("/api/article", {
      params: {
        alias
      }
    });
    if (code === 1 && article) {
      return {
        article
      };
    } else {
      error({
        statusCode: 404,
        message: "未找到该页面"
      });
    }
  },
  mounted() {
    this.scrollByHash();
    window.addEventListener("hashchange", () => {
      this.scrollByHash();
    });
    this.generateMenu();
  },
  methods: {
    generateMenu() {
      const result: Array<IHeading2> = [];
      const content = document.querySelector(".article-content") as HTMLElement;
      const h2All = content.querySelectorAll("h2");
      h2All.forEach(h2 => {
        const anchor = h2.querySelector("a");
        if (anchor) {
          const h2Item: IHeading2 = {
            href: `#${anchor.id}`,
            title: h2.textContent as string,
            subs: []
          };
          let nextEl = h2.nextElementSibling;
          while (nextEl && nextEl.nodeName !== "H2") {
            if (nextEl.nodeName === "H3") {
              const anchor = nextEl.querySelector("a");
              if (anchor) {
                h2Item.subs.push({
                  href: `#${anchor.id}`,
                  title: nextEl.textContent as string
                });
              }
            }
            nextEl = nextEl.nextElementSibling;
          }
          result.push(h2Item);
        }
      });
      if (result.length) {
        this.menus = result;
        this.menuShow = true;
      }
    },
    scrollByHash() {
      const prefix = "user-content-";
      let hash = decodeURIComponent(location.hash);
      if (hash && hash.length > 0) {
        hash = hash.substring(1);
      }
      if (hash.indexOf(prefix) === 0) {
        history.replaceState(
          null,
          "",
          location.href.replace(/#.*/, "") + "#" + hash.replace(prefix, "")
        );
      } else {
        const anchor = document.querySelector(`#${prefix}${hash}`);
        if (anchor) {
          window.scrollTo(
            window.scrollX,
            anchor.getBoundingClientRect().top + window.scrollY - 75
          );
        }
      }
    }
  }
});
</script>
<style>
.content-wrap {
  position: relative;
  padding: 40px;
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 4px;
  background: #fff;
  transition: width 0.3s;
  max-width: 1012px;
  width: calc(100% - 560px);
  min-height: 70vh;
}

@media (max-width: 1150px) {
  .content-wrap {
    width: 100%;
  }
  .menu-wrap {
    display: none;
  }
}

.article-title {
  margin: 40px 0 100px;
  text-align: center;
}

.article-title span {
  color: #777;
}

.article-title h1 {
  font-size: 25px;
  font-weight: 500;
  margin-top: 8px;
}

.article-main {
  min-height: 50vh;
}

.menu-wrap {
  width: 230px;
  position: absolute;
  right: -250px;
  top: 0;
}

.menu-container {
  position: fixed;
  width: 230px;
  background: #fff;
  padding: 25px 20px;
  user-select: none;
  border-radius: 4px;
  opacity: 1;
  transition: opacity 3s;
}

.btn-menu {
  position: fixed;
  background: #fff;
  outline: none;
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 3px;
  cursor: pointer;
}

.ant-affix {
  top: 100px !important;
}

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4,
.article-content h5 {
  position: relative;
}

.anchor {
  float: left;
  padding-right: 4px;
  margin-left: -20px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.2s;
}

.article-content h1:hover .anchor,
.article-content h2:hover .anchor,
.article-content h3:hover .anchor,
.article-content h4:hover .anchor,
.article-content h5:hover .anchor {
  opacity: 1;
}

.menu-title {
  font-size: 16px;
  margin-bottom: 8px;
}

.ant-anchor-ink::before {
  width: 3px;
  background-color: #eee;
}

.license-wrap {
  position: relative;
  border: 1px dashed #ccc;
  border-radius: 5px;
  padding: 10px 14px 5px;
  margin: 40px 0 70px;
}

.license-wrap::after {
  content: "";
  position: absolute;
  right: 7px;
  top: 7px;
  width: 7px;
  height: 7px;
  background: #1890ff;
  border-radius: 50%;
}

.license-wrap > span,
.end-wrap span {
  position: absolute;
  left: 50%;
  top: -12px;
  transform: translate(-50%, 0);
  display: block;
  background: #fff;
  font-weight: 500;
  user-select: none;
}

.license-wrap > p {
  margin-bottom: 5px;
}

.end-wrap {
  position: relative;
  border-top: 1px solid #ddd;
  margin: 40px 0 70px;
}
</style>
