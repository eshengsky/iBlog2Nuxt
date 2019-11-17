<template>
  <div class="comment-item">
    <div class="avatar">
      <img :data-src="comment.avatar" class="lazyload" @error="$emit('imgLoadError', $event)" />
    </div>
    <div class="comment-right">
      <div class="comment-title">
        <span v-if="comment.username === authGithub" class="auth-tag">作者</span>
        <a-tooltip :content="comment.displayName" transfer>
          <a
            class="comment-username"
            :href="`https://github.com/${comment.username}`"
            target="_blank"
          >{{ comment.username }}</a>
        </a-tooltip>
        <span class="comment-time">{{ comment.commentTimeStr }}</span>
      </div>
      <client-only>
        <tui-editor-viewer :value="comment.content" />
      </client-only>
      <div class="comment-footer" v-if="!hideReply">
        <a @click="$emit('showReply', $event, pathId)" v-if="user">
          <font-awesome-icon :icon="['fas', 'reply']"></font-awesome-icon>
          <span>回复</span>
        </a>
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
    pathId: {
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
