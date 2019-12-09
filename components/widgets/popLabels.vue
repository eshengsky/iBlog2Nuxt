<template>
  <div class="widget-container">
    <div class="widget-header">
      热门标签
    </div>
    <div class="widget-body">
      <a-spin :spinning="spinning" />
      <span
        v-for="(item, index) in list"
        :key="index"
        class="pop-label"
        @click="selectLabel(item._id)"
      >{{ item._id }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IResp } from '@/server/types';
export default Vue.extend({
    data () {
        return {
            list: [],
            spinning: false
        };
    },
    async created () {
        this.spinning = true;
        const { code, data }: IResp = await this.$axios.$get('/api/popLabels');
        if (code === 1) {
            this.list = data.labels;
        }
        this.spinning = false;
    },
    methods: {
        selectLabel (label) {
            window.scrollTo(0, 0);
            this.$emit('selectLabel', label);
        }
    }
});
</script>

<style>
.pop-label {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #555;
  border-radius: 50px;
  background-color: #eee;
  transition: all 0.3s ease;
  padding: 3px 14px;
  margin-right: 7px;
  margin-bottom: 10px;
  cursor: pointer;
}

.pop-label:hover {
  color: #fff;
  background-color: #1890ff;
}
</style>
