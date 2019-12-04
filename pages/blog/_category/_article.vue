<template>
  <div class="article-page-wrap">
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
      <comment-list :from="2" :articleId="article._id"></comment-list>
    </article>
    <aside class="menu-wrap">
      <a-anchor :offsetTop="100">
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
    </aside>
  </div>
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
      article: {},
      menus: [] as Array<IHeading2>
    };
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
    this.generateMenu();
    window.addEventListener("hashchange", () => {
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
            anchor.getBoundingClientRect().top + window.scrollY
          );
        }
      }
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
      this.menus = result;
    }
  }
});
</script>
<style>
.article-page-wrap {
  background: #f3f3f4;
  padding-top: 30px;
  display: flex;
  justify-content: center;
}

.content-wrap {
  padding: 40px 30px;
  background: #fff;
  border-color: #e7eaec;
  border-style: solid solid none;
  border-width: 1px 0;
  transition: width 0.3s;
  min-height: 400px;
  max-width: 1024px;
  min-height: 100vh;
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
  margin-left: 20px;
  flex: none;
  max-height: 100vh
}
</style>
