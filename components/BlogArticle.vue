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
        <div class="comments-top">
          <div>
            <span v-if="commentCount === 0">暂无评论</span>
            <span v-else>共{{ commentCount }}条评论</span>
          </div>
          <div v-if="user">
            {{ user.displayName }}
            <a href="/logout">退出</a>
          </div>
          <div v-else>
            <a href="/auth/github">登录</a>后才可评论
          </div>
        </div>
        <div class="post-wrap" v-if="user">
          <div class="avatar"><img :src="user._json.avatar_url" /></div>
          <div class="editor-wrap">
            <editor ref="editor" v-model="editorText" height="150px" :options="editorOptions" />
            <div class="comment-btn-wrap">
              <Tooltip content="支持除标题外的其它Markdown语法" transfer>
                <a href="https://www.jianshu.com/p/191d1e21f7ed" target="_blank">
                  <font-awesome-icon :icon="['fab', 'markdown']" style="font-size: 14px"></font-awesome-icon>
                </a>
              </Tooltip>
              <Button type="primary" size="large" @click="postComment">
                <font-awesome-icon :icon="['far', 'paper-plane']"></font-awesome-icon> 评论
              </Button>
            </div>
          </div>
        </div>
        <div class="comment-list">
          <ul>
            <li class="comment-item" v-for="comment in commentList" :key="comment._id">
              <div class="avatar"><img :src="comment.avatar" /></div>
              <div class="comment-right">
                <div>
                  <a
                    :href="`https://github.com/${comment.username}`"
                    target="_blank"
                    :title="comment.username"
                  >{{ comment.displayName }}</a>
                  {{ comment.commentTimeStr }}
                </div>
                <viewer :value="comment.content" />
              </div>
            </li>
          </ul>
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
        language: "zh_CN",
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
    user: state => state.user,
    commentList: state => state.commentList,
    commentCount: state => state.commentCount
  }),
  created() {
    this.$store.dispatch("getCommentList");
  },
  methods: {
    async postComment() {
      const content = this.editorText.trim();
      if (!content) {
        return this.$refs.editor.invoke("focus");
      }
      await this.$store.dispatch("saveComment", {
        content
      });
      this.$store.dispatch("getCommentList");
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

.comments-wrap {
  font-size: 14px;
}

.tui-tooltip {
  border-radius: 4px;
}

.tui-editor-defaultUI .CodeMirror-lines {
  padding-top: 10px;
  padding-bottom: 10px;
}

.tui-editor-defaultUI .CodeMirror-line {
  padding-left: 10px;
  padding-right: 10px;
}

.tui-toolbar-icons:disabled {
  display: none;
}

.tui-toolbar-icons:disabled + .tui-toolbar-divider {
  display: none;
}

.CodeMirror pre {
  line-height: 1.6;
}

.comment-btn-wrap {
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  border-color: #e5e5e5;
  border-style: solid;
  border-width: 0 1px 1px;
  align-items: center;
  padding: 6px 10px;
}

.comment-btn-wrap div {
  font-size: 12px;
  color: #666;
}

.comments-top {
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  border-bottom: 3px double #eee;
  margin-bottom: 30px;
  padding-bottom: 15px;
}

.post-wrap {
  display: -webkit-flex;
  display: flex;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
}

.avatar img {
  transition: transform .2s;
}

.avatar img:hover {
  transform: scale(1.2);
}

.editor-wrap {
  flex: auto;
  margin-left: 20px;
}

.comment-item {
  display: flex;
}

.comment-right {
  margin-left: 20px;
}
</style>