<template>
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
          @load="onEditorLoad"
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
      <div class="editor-wrap editor-reply">
        <editor
          ref="editorReply"
          v-model="editorReplyText"
          height="85px"
          :options="editorOptions"
          @load="onEditorReplyLoad"
          @focus="onEditorReplyFocus"
          @blur="onEditorReplyBlur"
        />
        <div class="comment-btn-wrap">
          <Tooltip content="支持除标题外的其它Markdown语法" transfer>
            <a href="https://www.jianshu.com/p/191d1e21f7ed" target="_blank">
              <font-awesome-icon :icon="['fab', 'markdown']" style="font-size: 14px"></font-awesome-icon>
              <span>支持Markdown语法</span>
            </a>
          </Tooltip>
          <div>
            <Button type="text" @click="hideReply">收起</Button>
            <Button type="primary" @click="sendReply">
              <span>回复</span>
            </Button>
          </div>
        </div>
      </div>
      <ul>
        <li v-for="comment1 in comments" :key="comment1._id">
          <div class="comment-item">
            <div class="avatar">
              <img :src="comment1.avatar" />
            </div>
            <div class="comment-right">
              <div class="comment-title">
                <Tooltip :content="comment1.username" transfer>
                  <a
                    class="comment-username"
                    :href="`https://github.com/${comment1.username}`"
                    target="_blank"
                  >{{ comment1.displayName }}</a>
                </Tooltip>
                <span class="comment-time">{{ comment1.commentTimeStr }}</span>
              </div>
              <viewer :value="comment1.content" />
              <div class="comment-footer">
                <a @click="showReply($event, comment1._id)">
                  <font-awesome-icon :icon="['fas', 'reply']"></font-awesome-icon>
                  <span>回复</span>
                </a>
              </div>
            </div>
          </div>
          <ul v-if="comment1.comments && comment1.comments.length">
            <li v-for="comment2 in comment1.comments" :key="comment2._id">
              <div class="comment-item">
                <div class="avatar">
                  <img :src="comment2.avatar" />
                </div>
                <div class="comment-right">
                  <div class="comment-title">
                    <Tooltip :content="comment2.username" transfer>
                      <a
                        class="comment-username"
                        :href="`https://github.com/${comment2.username}`"
                        target="_blank"
                      >{{ comment2.displayName }}</a>
                    </Tooltip>
                    <span class="comment-time">{{ comment2.commentTimeStr }}</span>
                  </div>
                  <viewer :value="comment2.content" />
                </div>
              </div>
              <ul v-if="comment2.comments && comment2.comments.length">
                <li v-for="comment3 in comment2.comments" :key="comment3._id">
                  <div class="comment-item">
                    <div class="avatar">
                      <img :src="comment3.avatar" />
                    </div>
                    <div class="comment-right">
                      <div class="comment-title">
                        <Tooltip :content="comment3.username" transfer>
                          <a
                            class="comment-username"
                            :href="`https://github.com/${comment3.username}`"
                            target="_blank"
                          >{{ comment3.displayName }}</a>
                        </Tooltip>
                        <span class="comment-time">{{ comment3.commentTimeStr }}</span>
                      </div>
                      <viewer :value="comment3.content" />
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      editorText: "",
      editorReplyText: "",
      pathId: "",
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
    user: state => state.user,
    comments: state => state.article.comments,
    commentCount: state => {
      return state.article.comments.length;
    }
  }),
  mounted() {
    // 回复框需默认显示，此处再手动设为隐藏，以确保tui-editor渲染正常
    document.querySelector(".editor-reply").style.display = "none";
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
      this.$store.dispatch("getArticle");
      this.editorText = "";
    },

    onEditorLoad() {
      document.querySelector(".post-wrap .comment-btn-wrap").style.display =
        "flex";
    },

    onEditorFocus() {
      document
        .querySelector(".post-wrap .te-md-container .CodeMirror")
        .classList.add("editor-focus");
    },

    onEditorBlur() {
      document
        .querySelector(".post-wrap .te-md-container .CodeMirror")
        .classList.remove("editor-focus");
    },

    onEditorReplyLoad() {
      document.querySelector(".comment-list .comment-btn-wrap").style.display =
        "flex";
    },

    onEditorReplyFocus() {
      document
        .querySelector(".comment-list .te-md-container .CodeMirror")
        .classList.add("editor-focus");
    },

    onEditorReplyBlur() {
      document
        .querySelector(".comment-list .te-md-container .CodeMirror")
        .classList.remove("editor-focus");
    },

    showReply(el, pathId) {
      if (pathId !== this.pathId) {
        this.editorReplyText = "";
      }
      this.pathId = pathId;
      let linkEl = el.target;
      if (linkEl.nodeName !== "A") {
        linkEl = linkEl.parentElement;
      }
      const replyEl = document.querySelector(".editor-reply");
      linkEl.parentElement.parentElement.appendChild(replyEl);
      replyEl.style.display = "block";
      setTimeout(() => {
        console.log(this.$refs.editorReply);
        this.$refs.editorReply.invoke("focus");
      }, 0);
    },

    hideReply() {
      const replyEl = document.querySelector(".editor-reply");
      replyEl.style.display = "none";
    },

    async sendReply() {
      const content = this.editorReplyText.trim();
      if (!content) {
        setTimeout(() => {
          document.querySelector(".tui-editor-defaultUI").click();
          return this.$refs.editorReply.invoke("focus");
        }, 1000);
      }
      await this.$store.dispatch("saveComment", {
        content,
        pathId: this.pathId
      });
      this.$store.dispatch("getArticle");
      this.editorReplyText = "";
      this.hideReply();
    }
  }
};
</script>
<style>
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
  display: none;
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
  width: 50px;
  height: 50px;
  border-radius: 4px;
  overflow: hidden;
  flex: none;
  margin-right: 16px;
}

.avatar img {
  transition: transform 0.2s;
}

.avatar img:hover {
  transform: scale(1.2);
}

.editor-wrap {
  flex: auto;
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
}

.comment-list > ul > li {
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.comment-right {
  flex: auto;
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

.comment-list li > ul {
  margin-left: 66px;
}

.comment-list .te-toolbar-section {
  display: none;
}

.comment-footer a {
  font-size: 12px;
  color: #888;
}

.comment-footer a:hover {
  color: #555;
}
</style>
