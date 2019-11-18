<template>
  <div class="post-wrap">
    <div class="post-top">
      <div class="post-top-left">
        <a @click="sortList('date')" :class="{ active: sortBy === 'date' }">日期</a>
        <a @click="sortList('title')" :class="{ active: sortBy === 'title' }">标题</a>
      </div>
      <div class="post-top-right">
        <a-select v-model="filterType" @on-change="filterTypeChange" style="width: 70px">
          <a-select-option value="text">全文</a-select-option>
          <a-select-option value="title">标题</a-select-option>
          <a-select-option value="tag">标签</a-select-option>
          <a-select-option value="date">日期</a-select-option>
        </a-select>
        <a-input
          v-if="filterType !== 'date'"
          v-model="inputTxt"
          style="width: 200px"
          :placeholder="searchPhd"
          allowClear
          ref="inputComp"
          @on-enter="search"
        />
        <a-range-picker
          v-if="filterType === 'date'"
          v-model="inputDate"
          placeholder="选择日期范围"
          :disabledDate="disabledDate"
          :ranges="rangeDate"
          :defaultPickerValue="defaultRange"
          style="width: 200px"
          ref="dateComp"
        ></a-range-picker>
        <a-button @click="search">搜索</a-button>
      </div>
    </div>
    <ul class="post-list">
      <li class="filter-li" v-show="alertShow">
        <div class="alert-filter">
          <div>共有<span>{{ count }}</span>条筛选结果</div>
          <a @click="clearSearch">清除搜索</a>
        </div>
      </li>
      <li v-for="item in posts" :key="item._id">
        <post-item :post="item"></post-item>
      </li>
      <li class="last-li">
        <div class="dot-loading" v-if="isLoading">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <a-button
          class="btn-load"
          size="large"
          @click="loadNext"
          v-else-if="posts.length > 0 && hasNext"
          :loading="isLoading"
        >下一页</a-button>
        <div class="no-more" v-else-if="posts.length > 0 && !hasNext">没有更多数据</div>
        <div class="no-data" v-else>暂无数据</div>
      </li>
    </ul>
    <footer class="copyright">2019 © All Rights Reserved | 浙ICP备15032882号 | 后台管理</footer>
    <!-- <a-drawer
      :title="article.title"
      v-model="drawer"
      width="66.66%"
      :closable="false"
    >
      <article class="preview-article" v-html="article.html"></article>
      <footer class="preview-footer">
        <i-button @click="closeDrawer">关闭</i-button>
        <i-button
          type="primary"
          :href="`/blog/${article.category.alias}/${article.alias}`"
          target="_blank"
        >完整模式</i-button>
      </footer>
    </a-drawer> -->
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from "vue";
import moment from 'moment';
import { ICategory } from "@/server/models/category";
import PostItem from "~/components/PostItem.vue";
import "highlight.js/styles/tomorrow.css";
export default Vue.extend({
  scrollToTop: true,
  components: {
    PostItem
  },
  props: {
    category: {
      type: Object,
      default() {
        return null;
      }
    } as PropOptions<ICategory>
  },
  data() {
    return {
      posts: [] as any[],
      isLoading: false,
      hasNext: false,
      count: 0,
      sortBy: "date",
      keyword: "",
      filterType: "text",
      inputTxt: "",
      inputDate: ["", ""],
      page: 1,
      drawer: false,
      alertShow: false,
      defaultRange: [moment().subtract(30, "days"), moment()],
      rangeDate: {
        今天: [moment(), moment()],
        最近一周: [moment().subtract(7, "days"), moment()],
        最近一月: [moment().subtract(30, "days"), moment()],
        最近一年: [moment().subtract(365, "days"), moment()]
      }
    };
  },
  created() {
    this.isLoading = true;
    this.getPosts();
  },
  computed: {
    searchPhd() {
      let placeholder = "";
      switch (this.filterType) {
        case "text":
          placeholder = "全文关键字";
          break;
        case "title":
          placeholder = "标题关键字";
          break;
        case "tag":
          placeholder = "标签关键字";
          break;
        default:
      }
      return placeholder;
    }
  },
  methods: {
    disabledDate(date) {
      return date && date > moment().endOf('day');
    },
    async getPosts() {
      this.isLoading = true;
      const startTime = new Date().getTime();
      const { code, data } = await this.$axios.$get("/api/posts", {
        params: {
          category: this.category._id,
          pageIndex: this.page,
          filterType: this.filterType,
          keyword: this.keyword,
          sortBy: this.sortBy
        }
      });

      // loading 时间过短体验也不好，这里设置一个最少 loading 时间
      const duration: number = new Date().getTime() - startTime;
      const minLoadingTimeout = 1000;
      const timeout =
        duration > minLoadingTimeout ? 0 : minLoadingTimeout - duration;
      await new Promise(resolve => {
        setTimeout(() => {
          if (code === 1) {
            this.posts.push(...data.postList);
            this.hasNext = data.hasNext;
            this.count = data.count;
          }
          this.isLoading = false;
          resolve();
        }, timeout);
      });
    },
    loadNext() {
      this.page++;
      this.getPosts();
    },
    closeDrawer() {
      this.drawer = false;
    },
    filterTypeChange() {
      this.$nextTick(() => {
        if (this.filterType !== "date") {
          (this.$refs.inputComp as any).focus();
        } else {
          (<HTMLElement>document.querySelector(".ivu-date-picker input")).click();
        }
      });
    },
    async search(checkKeyword = true) {
      // let input = "";
      // if (this.filterType === "date") {
      //   input = this.inputDate;
      //   if (checkKeyword && !input[0] && !input[1]) {
      //     document.querySelector(".ivu-date-picker input").click();
      //     return;
      //   }
      // } else {
      //   input = this.inputTxt;
      //   if (checkKeyword && !input) {
      //     this.$refs.inputComp.focus();
      //     return;
      //   }
      // }
      // this.alertShow = false;
      // this.posts = [];
      // this.page = 1;
      // this.hasNext = false;
      // this.keyword = input;
      // await this.getPosts();
      // if (input) {
      //   this.alertShow = true;
      // }
    },
    clearSearch() {
      this.alertShow = false;
      this.posts = [];
      this.page = 1;
      this.hasNext = false;
      this.keyword = "";
      this.inputTxt = "";
      this.inputDate = ["", ""];
      this.getPosts();
    },
    async sortList(sortBy) {
      if (this.sortBy === sortBy) {
        return;
      }
      this.sortBy = sortBy;
      this.search(false);
    }
  }
});
</script>
<style>
.post-wrap {
  margin: 30px 0 15px 280px;
  border-color: #e7eaec;
  border-style: solid solid none;
  border-width: 1px 0;
  position: relative;
  width: 66.66%;
}

.post-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  height: 59px;
  border-bottom: 1px solid #e7eaec;
  padding: 20px;
}

.post-top-left a {
  font-size: 16px;
  color: #999;
  cursor: pointer;
}

.post-top-left a.active {
  color: #555;
}

.post-top-right {
  display: flex;
}

.post-list {
  background: #fff;
  min-height: calc(100vh - 160px);
  padding: 20px 20px 0;
  margin-bottom: 0;
}

.btn-load {
  width: 100%;
  margin-bottom: 20px;
  font-size: 15px;
}

.ivu-drawer-header-inner {
  font-size: 18px;
  line-height: 18px;
  padding: 0 10px;
  color: #333;
}

.ivu-drawer-body {
  height: calc(100% - 51px - 57px);
  position: static;
}

.preview-article {
  padding: 0 10px 10px;
  font-size: 16px;
}

.preview-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}

.no-more {
  text-align: center;
  color: #888;
  font-size: 14px;
  padding: 10px;
  -webkit-user-select: none;
  user-select: none;
}

.no-data {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin: 20px 0;
  -webkit-user-select: none;
  user-select: none;
}

@-webkit-keyframes dot-loading {
  0% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
    opacity: 0.5;
  }

  33.33% {
    -webkit-transform: scale(1.667, 1.667);
    transform: scale(1.667, 1.667);
    opacity: 1;
  }

  66.66% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
    opacity: 0.5;
  }

  100% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
    opacity: 0.5;
  }
}

@keyframes dot-loading {
  0% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
    opacity: 0.5;
  }

  33.33% {
    -webkit-transform: scale(1.667, 1.667);
    transform: scale(1.667, 1.667);
    opacity: 1;
  }

  66.66% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
    opacity: 0.5;
  }

  100% {
    -webkit-transform: scale(1, 1);
    transform: scale(1, 1);
    opacity: 0.5;
  }
}

.dot-loading {
  transform: translate(-50%, 0);
  position: absolute;
  left: 50%;
  width: 70px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
}

.post-list li.last-li:first-of-type .dot-loading {
  margin-top: 10px;
}

.dot-loading > div {
  width: 6px;
  height: 6px;
  border-radius: 100%;
  opacity: 0.5;
  -webkit-animation: dot-loading 1.2s linear infinite;
  animation: dot-loading 1.2s linear infinite;
}

.dot-loading > div:nth-child(1) {
  background: #fe3c71;
}

.dot-loading > div:nth-child(2) {
  background: #fe686c;
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.dot-loading > div:nth-child(3) {
  background: #fe7f6a;
  -webkit-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.ivu-picker-panel-body-wrapper {
  font-size: 14px;
}

.post-top-right .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
.post-top-right .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  font-size: 14px;
  padding-left: 12px;
}

.post-top-right .ivu-select-visible .ivu-select-selection,
.post-top-right .ivu-select-selection-focused,
.post-top-right .ivu-select-selection:hover {
  border-color: #dcdee3;
  box-shadow: none;
}

.ivu-select-item {
  font-size: 14px !important;
}

.ivu-select-selection {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  margin-right: -1px;
}

.post-top-right .ivu-input {
  border-radius: 0;
  font-size: 13px;
}

.post-top-right .ivu-input:hover,
.post-top-right .ivu-input:focus {
  border-color: #dcdee2;
  box-shadow: none;
}

.post-top-right button.ivu-btn {
  font-size: 14px;
  line-height: 1;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin-left: -1px;
  z-index: 1;
}

.post-top-right .ivu-date-picker-focused input {
  border-color: #dcdee2;
  box-shadow: none;
}

.ivu-icon-ios-close-circle,
.ivu-input-suffix i.ivu-icon-ios-close-circle {
  color: #999;
}

.copyright {
  color: #888;
  font-size: 13px;
  text-align: center;
  padding: 25px 0 10px;
}

.last-li {
  position: relative;
  height: 60px;
}

.alert-filter {
  display: flex;
  justify-content: space-between;
  border: 1px solid #abdcff;
  background-color: #f0faff;
  padding: 10px 12px;
  font-size: 14px;
  position: relative;
  border-radius: 4px;
  margin-bottom: 20px;
  color: #555;
  line-height: 1.5;
}

.alert-filter span {
  margin: 0 2px;
}
</style>