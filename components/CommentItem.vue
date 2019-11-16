<template>
  <no-ssr>
    <div class="comment-item">
      <div class="avatar">
        <img :data-src="comment.avatar" class="lazyload" @error="$emit('imgLoadError', $event)" />
      </div>
      <div class="comment-right">
        <div class="comment-title">
          <span v-if="comment.username === authGithub" class="auth-tag">作者</span>
          <Tooltip :content="comment.displayName" transfer>
            <a
              class="comment-username"
              :href="`https://github.com/${comment.username}`"
              target="_blank"
            >{{ comment.username }}</a>
          </Tooltip>
          <span class="comment-time">{{ comment.commentTimeStr }}</span>
        </div>
        <viewer :value="comment.content" />
        <div class="comment-footer" v-if="!hideReply">
          <a @click="$emit('showReply', $event, pathId)" v-if="user">
            <font-awesome-icon :icon="['fas', 'reply']"></font-awesome-icon>
            <span>回复</span>
          </a>
        </div>
      </div>
    </div>
  </no-ssr>
</template>
<script>
import Vue from "vue";
import { mapState } from "vuex";
export default Vue.extend({
  props: ["comment", "pathId", "hideReply"],
  computed: {
    ...mapState({
      user: state => state.user,
      authGithub: state => state.config.authGithub
    })
  }
});
</script>