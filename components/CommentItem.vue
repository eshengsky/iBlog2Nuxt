<template>
  <div>
    <div class="comment-item">
      <div class="comment-item-avatar">
        <img
          :data-src="comment.avatar"
          class="lazyload"
          @error="$emit('imgLoadError', $event)"
        />
      </div>
      <div class="comment-item-body">
        <div class="timeline-comment">
          <div class="timeline-comment-header">
            <div>
              <a-tooltip>
                <template slot="title">{{ comment.displayName }}</template>
                <a
                  class="comment-username"
                  :href="`https://github.com/${comment.username}`"
                  target="_blank"
                  >{{ comment.username }}</a
                >
              </a-tooltip>
              <span v-if="comment.username === authGithub" class="comment-admin"
                >作者</span
              >
              <span class="comment-time">{{ comment.commentTimeStr }}</span>
            </div>
            <div class="comment-header-actions">
              <a
                @click="
                  $emit('referenceReply', $event, commentId, comment.content)
                "
                v-if="user"
              >
                <font-awesome-icon :icon="['fas', 'reply']"></font-awesome-icon>
                <span>引用回复</span>
              </a>
            </div>
          </div>
          <div class="comment-body">
            <client-only>
              <tui-editor-viewer :value="comment.content" />
            </client-only>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from "vue";
import { RootState } from "@/store/index";
import { IComment } from "@/server/models/comment";
import config from "@/blog.config";
import { Prop } from "vue/types/options";
export default Vue.extend({
  props: {
    comment: {
      type: Object
    } as PropOptions<IComment>,
    commentId: {
      type: String
    } as PropOptions<string>,
    hideReply: {
      type: Boolean
    } as PropOptions<boolean>
  },
  data() {
    return {
      authGithub: config.adminGithubUser
    };
  },
  computed: {
    user(): any {
      return (this.$store.state as RootState).user;
    }
  }
});
</script>
<style>
.comment-item {
  position: relative;
  display: flex;
  padding: 16px 0;
  margin-left: 27px;
}

.comment-item:before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  display: block;
  width: 2px;
  content: "";
  background-color: #e1e4e8;
}

.comment-item-avatar {
  position: absolute;
  left: -82px;
  z-index: 1;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background: url(data:image/png;base64,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)
    10px 9px no-repeat #ccc;
  background-size: 30px;
}

.comment-item-avatar img {
  transition: transform .6s, opacity 1.5s;
}

.comment-item-avatar img:hover {
  transform: rotate(360deg);
}

.comment-item-body {
  min-width: 0;
  max-width: 100%;
  color: #444d56;
  flex: auto;
}

.timeline-comment {
  position: relative;
  color: #24292e;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-left: -16px;
}

.timeline-comment:after,
.timeline-comment:before {
  position: absolute;
  top: 11px;
  right: 100%;
  left: -16px;
  display: block;
  width: 0;
  height: 0;
  pointer-events: none;
  content: " ";
  border-color: transparent;
  border-style: solid solid outset;
}

.timeline-comment:before {
  border-width: 8px;
  border-right-color: #ddd;
}

.timeline-comment:after {
  margin-top: 1px;
  margin-left: 2px;
  border-width: 7px;
  border-right-color: #f6f8fa;
}

.timeline-comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  color: #586069;
  background-color: #f6f8fa;
  border-bottom: 1px solid #ddd;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.comment-username {
  font-size: 14px;
  font-weight: bold;
  margin-right: 4px;
}

.comment-admin {
  display: inline-block;
  border-radius: 3px;
  font-size: 12px;
  padding: 0px 5px 1px;
  color: #fa8c16;
  background: #fff7e6;
  border: 1px solid #ffd591;
  margin-right: 4px;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-body {
  width: 100%;
  padding: 15px;
  overflow: visible;
  font-size: 14px;
}

.comment-header-actions a {
  font-size: 12px;
  color: #888;
  -webkit-user-select: none;
  user-select: none;
}

.comment-header-actions a:hover {
  color: #444;
}
</style>
