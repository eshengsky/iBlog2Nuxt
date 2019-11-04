<template>
  <div class="comments-wrap">
    <div class="comments-top">
      <div class="comments-top-left">
        <span v-if="commentCount === 0">暂无{{ commentName }}</span>
        <span v-else>
          <span style="margin: 0 1px;">{{ commentCount }}</span>
          条{{ commentName }}
        </span>
      </div>
      <div class="comments-top-right">
        <template v-if="user">
          {{ user.displayName }}
          <a href="/logout">退出</a>
        </template>
        <template v-else>
          <a href="/auth/github">登录</a>
          后才可{{ commentName }}
        </template>
      </div>
    </div>
    <div class="gituser-wrap" v-if="user">
      <div class="avatar">
        <img :src="user._json.avatar_url" @error="imgLoadError($event)" />
      </div>
      <div class="editor-wrap">
        <no-ssr>
          <editor
            ref="editor"
            v-model="editorText"
            height="150px"
            :options="editorOptions"
            @load="onEditorLoad"
            @focus="onEditorFocus"
            @blur="onEditorBlur"
          />
        </no-ssr>
        <div class="comment-btn-wrap">
          <Tooltip content="打开Markdown速查表" transfer>
            <a @click="mcsShow = true">
              <font-awesome-icon :icon="['fab', 'markdown']" style="font-size: 14px"></font-awesome-icon>
              <span>支持Markdown语法</span>
            </a>
          </Tooltip>
          <Button type="primary" @click="postComment">
            <font-awesome-icon :icon="['far', 'paper-plane']"></font-awesome-icon>
            <span>{{ commentName }}</span>
          </Button>
        </div>
      </div>
    </div>
    <div class="comment-list">
      <div class="editor-wrap editor-reply" v-show="isEditorReplyShown">
        <no-ssr>
          <editor
            ref="editorReply"
            v-model="editorReplyText"
            height="85px"
            :options="editorReplyOptions"
            @load="onEditorReplyLoad"
            @focus="onEditorReplyFocus"
            @blur="onEditorReplyBlur"
          />
        </no-ssr>
        <div class="comment-btn-wrap">
          <Tooltip content="打开Markdown速查表" transfer>
            <a @click="mcsShow = true">
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
        <li v-for="comment1 in pagedComments" :key="comment1._id">
          <comment-item
            :comment="comment1"
            :pathId="comment1._id"
            @showReply="showReply"
            @imgLoadError="imgLoadError"
          ></comment-item>
          <ul v-if="comment1.comments && comment1.comments.length">
            <li v-for="comment2 in comment1.comments" :key="comment2._id">
              <comment-item
                :comment="comment2"
                :pathId="`${comment1._id}>${comment2._id}`"
                @showReply="showReply"
                @imgLoadError="imgLoadError"
              ></comment-item>
              <ul v-if="comment2.comments && comment2.comments.length">
                <li v-for="comment3 in comment2.comments" :key="comment3._id">
                  <comment-item
                    :comment="comment3"
                    :hideReply="true"
                    @showReply="showReply"
                    @imgLoadError="imgLoadError"
                  ></comment-item>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li class="comments-last-li" v-if="hasNext">
          <Button class="btn-load" size="large" @click="loadNext">查看更多</Button>
        </li>
      </ul>
    </div>
    <no-ssr>
      <Modal v-model="mcsShow" title="Markdown 速查表" width="630">
        <Alert type="warning" show-icon closable>评论及留言不支持1~4级标题。</Alert>
        <md-cheat-sheet></md-cheat-sheet>
        <div slot="footer">
          <Button type="primary" @click="mcsShow = false">关闭</Button>
        </div>
      </Modal>
    </no-ssr>
  </div>
</template>
<script>
import CommentItem from "~/components/CommentItem.vue";
import MdCheatSheet from "~/components/MdCheatSheet.vue";
import { mapState } from "vuex";
export default {
  components: {
    CommentItem,
    MdCheatSheet
  },
  props: ["comments", "from"],
  data() {
    return {
      page: 1,
      pageSize: 20,
      mcsShow: false,
      editorText: "",
      editorReplyText: "",
      isEditorReplyShown: true,
      pathId: "",
      editorReplyOptions: {
        hideModeSwitch: true,
        language: "zh_CN",
        placeholder: "输入回复内容",
        toolbarItems: []
      }
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    }),
    pagedComments() {
      const start = (this.page - 1) * this.pageSize;
      return this.comments.slice(0, start + this.pageSize);
    },
    hasNext() {
      const count = this.comments.length;
      const pageCount =
        count % this.pageSize === 0
          ? parseInt(count / this.pageSize)
          : parseInt(count / this.pageSize) + 1;
      return pageCount > this.page;
    },
    commentName() {
      return this.from === 2 ? "评论" : "留言";
    },
    editorOptions() {
      return {
        hideModeSwitch: true,
        language: "zh_CN",
        placeholder: `输入${this.commentName}内容`,
        toolbarItems: [
          "bold",
          "italic",
          "strike",
          "divider",
          "hr",
          "quote",
          "divider",
          "ul",
          "ol",
          "task",
          "divider",
          "table",
          "link",
          "divider",
          "code",
          "codeblock"
        ]
      };
    },
    commentCount() {
      let total = 0;
      let comments = this.comments;
      const getCount = comments => {
        total += comments.length;
        comments.forEach(item => {
          getCount(item.comments);
        });
      };
      getCount(comments);
      return total;
    }
  },
  mounted() {
    // 回复框需默认显示，此处再手动设为隐藏，以确保tui-editor渲染正常
    this.$nextTick(() => {
      this.isEditorReplyShown = false;
    });
  },
  methods: {
    async postComment() {
      const content = this.editorText.trim();
      if (!content) {
        return this.$refs.editor.invoke("focus");
      }
      const result = await this.saveComment({
        content
      });
      if (result.code === "1") {
        this.$Message.success(`${this.commentName}成功`);
        this.getLatestData();
        this.editorText = "";
      } else if (result.code === "-2") {
        this.$Message.error(`请登录后再${this.commentName}`);
      } else {
        this.$Message.error(`${this.commentName}失败`);
      }
    },

    getLatestData() {
      if (this.from === 1) {
        return this.$store.dispatch("getGuestbook");
      }
      return this.$store.dispatch("getArticle");
    },

    saveComment(data) {
      if (this.from === 1) {
        return this.$store.dispatch("saveGuestbook", data);
      }
      return this.$store.dispatch("saveComment", data);
    },

    onEditorLoad() {
      document.querySelector(".gituser-wrap .comment-btn-wrap").style.display =
        "flex";
    },

    onEditorFocus() {
      document
        .querySelector(".gituser-wrap .te-md-container .CodeMirror")
        .classList.add("editor-focus");
    },

    onEditorBlur() {
      document
        .querySelector(".gituser-wrap .te-md-container .CodeMirror")
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

    // 头像加载失败时直接隐藏
    imgLoadError(event) {
      const img = event.target;
      img.style.display = "none";
    },

    showReply(event, pathId) {
      if (pathId !== this.pathId) {
        this.editorReplyText = "";
      }
      this.pathId = pathId;
      let linkEl = event.target;
      if (linkEl.nodeName !== "A") {
        linkEl = linkEl.parentElement;
      }
      const replyEl = document.querySelector(".editor-reply");
      linkEl.parentElement.parentElement.appendChild(replyEl);
      this.isEditorReplyShown = true;
      this.$nextTick(() => {
        this.$refs.editorReply.invoke("focus");
      });
    },

    hideReply() {
      this.isEditorReplyShown = false;
    },

    async sendReply() {
      const content = this.editorReplyText.trim();
      if (!content) {
        return this.$refs.editorReply.invoke("focus");
      }
      await this.saveComment({
        content,
        pathId: this.pathId
      });
      this.$Message.success("回复成功");
      this.getLatestData();
      this.editorReplyText = "";
      setTimeout(() => {
        this.hideReply();
      }, 0);
    },

    loadNext() {
      this.page++;
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

.comments-wrap .tui-editor-contents h1,
.comments-wrap .tui-editor-contents h2,
.comments-wrap .tui-editor-contents h3,
.comments-wrap .tui-editor-contents h4 {
  font-weight: bold;
  font-size: 1rem;
  line-height: 17px;
  margin: 10px 0 -4px;
  color: #333;
  border: 0;
  padding: 0;
}

.tui-editor-contents h4 {
  font-weight: bold;
}

.tui-editor-contents .task-list-item {
  margin-left: -15px;
}

.te-markdown-tab-section {
  -webkit-user-select: none;
  user-select: none;
}

.comment-btn-wrap {
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  background: #fff;
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

.gituser-wrap {
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
  background: url(data:image/png;base64,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)
    10px 9px no-repeat #ccc;
  background-size: 30px;
}

.avatar img {
  transition: transform 0.5s;
}

.avatar img:hover {
  transform: scale(1.3);
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

.comment-footer {
  margin-top: 10px;
  -webkit-user-select: none;
  user-select: none;
}

.comment-footer a {
  font-size: 12px;
  color: #888;
}

.comment-footer a:hover {
  color: #444;
}

.tui-editor-defaultUI .CodeMirror pre.CodeMirror-placeholder {
  padding-left: 12px;
}

.auth-tag {
  display: inline-block;
  border-radius: 3px;
  font-size: 12px;
  padding: 3px 5px 2px;
  background: #f90;
  color: #fff;
}

.comment-list > ul > li.comments-last-li {
  border: 0;
  margin-bottom: 0;
}
</style>
