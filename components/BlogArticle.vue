<template>
  <div class="detail-wrap">
    <article class="article-wrap">
      <header class="article-title">
        <span>
          <font-awesome-icon :icon="['far', 'clock']"></font-awesome-icon>
          {{ article.createTimeStr }}
        </span>
        <h1>{{ article.title }}</h1>
      </header>
      <main>
        <blockquote v-if="article.summary">{{ article.summary }}</blockquote>
        <div class="article-content" v-html="article.html"></div>
      </main>
      <div class="comments-wrap">
        <div>
          <div>共xx条评论</div>
          <div v-if="user">
            {{ user.displayName }}
            <a href="/logout">退出</a>
          </div>
          <div v-else>
            <a href="/auth/github">登录</a> 后才可评论
          </div>
        </div>
        <div v-if="user">
          <editor v-model="editorText" :options="editorOptions" />
          <Button @click="postComment">评论</Button>
        </div>
      </div>
    </article>
    <aside>Menu</aside>
  </div>
</template>
<script>
import { mapState } from "vuex";
import "highlight.js/styles/tomorrow.css";
export default {
  data() {
    return {
      editorText: "",
      editorOptions: {
        hideModeSwitch: true,
        language: 'zh_CN',
        toolbarItems: [
          "bold",
          "italic",
          "strike",
          "divider",
          "ul",
          "ol",
          "divider",
          "table",
          "image",
          "link",
          "divider",
          "code",
          "codeblock"
        ]
      }
    };
  },
  computed: mapState({
    article: state => state.article,
    user: state => state.user
  }),
  methods: {
    postComment() {
      console.log(this.editorText)
    }
  }
};
</script>
<style>
.detail-wrap {
  background: #f3f3f4;
  min-height: 100vh;
  padding-top: 30px;
}

.article-wrap {
  max-width: 1012px;
  margin: 0 auto 20px;
  padding: 40px 30px;
  background: #fff;
  border-color: #e7eaec;
  border-style: solid solid none;
  border-width: 1px 0;
  transition: width 0.3s;
  min-height: 400px;
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
}

.article-content {
  font-family: Consolas, "Courier New", monospace;
}

.tui-editor-defaultUI .te-tab button {
  height: 32px;
}

.te-markdown-tab-section .te-tab {
  margin-left: 12px;
}
</style>