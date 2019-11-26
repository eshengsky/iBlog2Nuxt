<template>
  <div :id="comment._id">
    <div class="comment-item">
      <div class="comment-item-avatar">
        <div v-html="avatar" class="avatar"></div>
      </div>
      <div class="comment-item-body">
        <div class="timeline-comment">
          <div class="timeline-comment-header">
            <div>
              <a
                class="comment-username"
                :href="comment.website"
                :title="comment.website"
                v-if="comment.website"
                target="_blank"
                >{{ comment.username }}</a
              >
              <span class="comment-username" v-else>{{
                comment.username
              }}</span>
              <span v-if="comment.username === 'Admin'" class="comment-admin"
                >作者</span
              >
              <span class="comment-time" :title="commentTime2">{{ commentTime }}</span>
            </div>
            <div class="comment-header-actions">
              <a @click="$emit('referenceReply', comment.content)">
                <font-awesome-icon
                  :icon="['fas', 'reply']"
                  style="position: relative; top: -1px;"
                ></font-awesome-icon>
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
import moment from "moment";
import { RootState } from "@/store/index";
import { IComment } from "@/server/models/comment";
import config from "@/blog.config";
import { Prop } from "vue/types/options";
export default Vue.extend({
  props: {
    comment: {
      type: Object
    } as PropOptions<IComment>,
    avatar: {
      type: String
    } as PropOptions<string>
  },
  data() {
    return {
      authGithub: config.githubAdmin
    };
  },
  computed: {
    commentTime(): string {
      return moment(this.comment.createTime).fromNow();
      // return moment(this.comment.createTime).format("YYYY-MM-DD HH:mm:ss");
    },
    commentTime2(): string {
      return moment(this.comment.createTime).format("YYYY-MM-DD HH:mm:ss");
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
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
  padding: 3px;
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
  font-weight: 500;
  margin-right: 3px;
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
  user-select: none;
}

.comment-time {
  color: #999;
  font-size: 12px;
  user-select: none;
}

.comment-body {
  width: 100%;
  padding: 12px 15px;
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
