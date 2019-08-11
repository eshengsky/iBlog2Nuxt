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
      <main class="article-main">
        <blockquote v-if="article.summary">{{ article.summary }}</blockquote>
        <div class="article-content" v-html="article.html"></div>
      </main>
      <div class="comments-wrap">
        <div class="comments-top">
          <div class="comments-top-left">
            <span v-if="commentCount === 0">暂无评论</span>
            <span v-else>
              <span style="margin: 0 1px;">{{ commentCount }}</span>条评论
            </span>
          </div>
          <div class="comments-top-right">
            <template v-if="user">
              {{ user.displayName }}
              <a href="/logout">退出</a>
            </template>
            <template v-else>
              <a href="/auth/github">登录</a>后才可评论
            </template>
          </div>
        </div>
        <div class="post-wrap" v-if="user">
          <div class="avatar">
            <img :src="user._json.avatar_url" />
          </div>
          <div class="editor-wrap">
            <editor
              ref="editor"
              v-model="editorText"
              height="150px"
              :options="editorOptions"
              @focus="onEditorFocus"
              @blur="onEditorBlur"
            />
            <div class="comment-btn-wrap">
              <Tooltip content="支持除标题外的其它Markdown语法" transfer>
                <a href="https://www.jianshu.com/p/191d1e21f7ed" target="_blank">
                  <font-awesome-icon :icon="['fab', 'markdown']" style="font-size: 14px"></font-awesome-icon>
                  <span>支持Markdown语法</span>
                </a>
              </Tooltip>
              <Button type="primary" size="large" @click="postComment">
                <font-awesome-icon :icon="['far', 'paper-plane']"></font-awesome-icon>
                <span>评论</span>
              </Button>
            </div>
          </div>
        </div>
        <div class="comment-list">
          <ul>
            <li class="comment-item" v-for="comment in commentList" :key="comment._id">
              <div class="avatar">
                <img :src="comment.avatar" />
              </div>
              <div class="comment-right">
                <div class="comment-title">
                  <Tooltip :content="comment.username" transfer>
                    <a
                      class="comment-username"
                      :href="`https://github.com/${comment.username}`"
                      target="_blank"
                    >{{ comment.displayName }}</a>
                  </Tooltip>
                  <span class="comment-time">{{ comment.commentTimeStr }}</span>
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
    // this.$store.dispatch("getCommentList");
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
      // this.$store.dispatch("getCommentList");
      this.editorText = "";
    },

    onEditorFocus() {
      document
        .querySelector(".te-md-container .CodeMirror")
        .classList.add("editor-focus");
    },

    onEditorBlur() {
      document
        .querySelector(".te-md-container .CodeMirror")
        .classList.remove("editor-focus");
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

.article-main {
  min-height: 500px;
}

.article-content {
  font-family: Consolas, "Courier New", monospace;
}

.tui-editor-defaultUI {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  overflow: auto;
}

.tui-editor-defaultUI .te-tab button {
  height: 32px;
}

.te-markdown-tab-section .te-tab {
  margin-left: 12px;
}

.comments-wrap {
  margin-top: 30px;
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

.editor-focus {
  border: 1px solid #57a3f3;
  box-shadow: inset 0 0 3px 2px rgba(45, 140, 240, 0.2);
}

.tui-editor-contents h1,
.tui-editor-contents h2,
.tui-editor-contents h3,
.tui-editor-contents h4 {
  font-size: 1rem;
  line-height: 17px;
  margin: 10px 0 -4px;
  color: #333;
  border: 0;
  padding: 0;
}

.te-markdown-tab-section {
  -webkit-user-select: none;
  user-select: none;
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
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  -webkit-user-select: none;
  user-select: none;
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
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  flex: none;
}

.avatar img {
  transition: transform 0.2s;
}

.avatar img:hover {
  transform: scale(1.2);
}

.editor-wrap {
  flex: auto;
  margin-left: 20px;
}

.editor-wrap::before {
  border-color: transparent;
  border-style: solid solid outset;
  content: " ";
  display: block;
  height: 0;
  left: -16px;
  pointer-events: none;
  position: absolute;
  right: 100%;
  top: 11px;
  width: 0;
  border-right-color: #d1d5da;
  border-width: 8px;
}

.comment-item {
  display: flex;
  margin-bottom: 20px;
  padding-bottom: 18px;
  border-bottom: 1px solid #eee;
}

.comment-right {
  flex: auto;
  margin-left: 20px;
  overflow: auto;
}

.te-md-container .te-preview {
  padding: 0 10px;
}

.comment-title {
  line-height: 14px;
  margin-bottom: 15px;
  -webkit-user-select: none;
  user-select: none;
}

.comment-username {
  font-size: 14px;
  font-weight: bold;
}

.comment-time {
  color: #999;
  font-size: 13px;
}

.comments-top-left {
  font-size: 16px;
  font-weight: 600;
}

.comments-top-right {
  font-size: 14px;
}

.tui-editor-contents pre {
  border-radius: 4px;
}

.tui-tooltip {
  max-width: 250px;
  min-height: 34px;
  padding: 8px 12px;
  color: #fff;
  text-align: left;
  text-decoration: none;
  background-color: rgba(70, 76, 91, 0.9);
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  opacity: 1;
}

.tui-tooltip .arrow {
  display: none;
}

.tui-editor-defaultUI-toolbar button:hover,
.tui-editor-defaultUI-toolbar button:active,
.tui-editor-defaultUI-toolbar button.active {
  border-color: #bbb;
  border-radius: 3px;
}

.tui-editor-popup {
    position: fixed;
    top: 50%;
    transform: translate(0, -50%);
}
</style>