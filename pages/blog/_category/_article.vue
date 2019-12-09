<template>
  <div class="post-detail-wrap">
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
          >CC BY-NC-SA 3.0</a>
          <span>许可协议。转载请注明来自</span>
          <a :href="website">{{ settings.blogName }}</a>。
        </p>
      </div>
      <div v-else class="end-wrap">
        <span>【END】</span>
      </div>
      <comment-list :from="2" :articleId="article._id"></comment-list>
    </article>
    <aside class="side-wrap">
      <div class="side-block-container">
        <div class="side-title">分类</div>
        <div class="category-title">
          <img :src="article.category.img" />
          <span>{{ article.category.cateName }}</span>
        </div>
        <nuxt-link class="ant-btn ant-btn-dashed" :to="`/blog/${article.category.alias}`">
          全部
          <span class="posts-count">{{ postsCount }}</span>
          篇文章
        </nuxt-link>
      </div>
      <div :class="{ 'sticky-wrap': menuShow }">
        <div class="side-block-container" v-show="menuShow">
          <div class="side-title">目录</div>
          <a-anchor :affix="false" :showInkInFixed="true" :offsetTop="75" :bounds="10">
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
        <pop-articles></pop-articles>
      </div>
    </aside>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "highlight.js/styles/tomorrow.css";
import CommentList from "@/components/CommentList.vue";
import PopArticles from "@/components/widgets/popArticles.vue";
import { IPost } from "@/server/models/post";
interface IHeading3 {
  href: string;
  title: string;
}
interface IHeading2 extends IHeading3 {
  subs: Array<IHeading3>;
}
export default Vue.extend({
  components: {
    CommentList,
    PopArticles
  },
  data() {
    return {
      settings: this.$store.state.settings,
      article: {} as IPost,
      menus: [] as Array<IHeading2>,
      menuShow: false,
      postsCount: 0
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
    },
    stickyCls() {
      if (this.menuShow) {
        return {
          position: "sticky",
          top: "90px"
        };
      }
      return {
        position: "relative"
      };
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
  async created() {
    const { code, data } = await this.$axios.$get("/api/postsCountByCate", {
      params: {
        category: this.article.category._id
      }
    });
    if (code === 1) {
      this.postsCount = data;
    }
  },
  mounted() {
    this.scrollByHash();
    window.addEventListener("hashchange", () => {
      this.scrollByHash();
    });
    this.generateMenu();
    
    // 文章浏览数+1
    this.$axios.$put('/api/increaseViews', {
      postID: this.article._id
    });
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
.post-detail-wrap {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.content-wrap {
  position: relative;
  padding: 40px;
  border-radius: 4px;
  background: #fff;
  max-width: 792px;
  min-height: 70vh;
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

.side-wrap {
  width: 260px;
  flex: none;
  margin-left: 20px;
}

@media (max-width: 835px) {
  .side-wrap {
    display: none;
  }
}

.side-block-container {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
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

.side-title {
  font-size: 16px;
  margin-bottom: 8px;
  user-select: none;
}

.side-wrap .category-title {
  border-top: 1px solid transparent;
  font-size: 15px;
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  color: #444;
}

.side-wrap .category-title img {
  width: 25px;
  height: 25px;
  position: absolute;
}

.side-wrap .category-title span {
  padding-left: 28px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.ant-anchor-ink::before {
  width: 3px;
  background-color: #eee;
}

.license-wrap {
  position: relative;
  border: 1px dashed #ccc;
  border-radius: 5px;
  padding: 13px 16px 8px;
  margin: 40px 0 70px;
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

.sticky-wrap {
  position: sticky;
  top: 90px;
}
</style>
