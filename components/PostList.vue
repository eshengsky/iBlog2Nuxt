<template>
  <div class="post-wrap">
    <div class="post-left">
      <div class="post-top">
        <div class="post-top-left">
          <a @click="sortList('date')" :class="{ active: sortBy === 'date' }"
            >日期</a
          >
          <a @click="sortList('title')" :class="{ active: sortBy === 'title' }"
            >标题</a
          >
        </div>
        <div class="post-top-right">
          <a-input-group compact>
            <a-select
              v-model="filterType"
              @change="filterTypeChange"
              style="width: 75px"
            >
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
              v-model="inputDateMoment"
              :disabledDate="disabledDate"
              :ranges="rangeDate"
              :defaultPickerValue="defaultRange"
              style="width: 200px"
              ref="dateComp"
            ></a-range-picker>
            <a-button @click="search">搜索</a-button>
          </a-input-group>
        </div>
      </div>
      <ul class="post-list">
        <li class="filter-li" v-show="alertShow">
          <div class="alert-filter">
            <div>
              共有<span>{{ count }}</span
              >条筛选结果
            </div>
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
          <template v-else>
            <template v-if="posts.length">
              <a-button
                class="btn-load"
                size="large"
                @click="loadNext"
                v-if="hasNext"
                :loading="isLoading"
                >下一页</a-button
              >
              <div class="no-more" v-else>没有更多数据</div>
            </template>
            <div class="no-data" v-else>
              <a-empty></a-empty>
            </div>
          </template>
        </li>
      </ul>
    </div>
    <div class="post-right">
      <blog-intro v-if="settings.showBlogIntro"></blog-intro>
      <article-calendar @selectCalendar="selectCalendar"></article-calendar>
      <pop-articles></pop-articles>
      <pop-labels></pop-labels>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropOptions } from "vue";
import moment, { Moment } from "moment";
import { ICategory } from "@/server/models/category";
import { IPost } from "@/server/models/post";
import { IResp } from "@/server/types";
import PostItem from "@/components/PostItem.vue";
import BlogIntro from "@/components/widgets/blogIntro.vue";
import ArticleCalendar from "@/components/widgets/articleCalendar.vue";
import PopArticles from "@/components/widgets/popArticles.vue";
import PopLabels from "@/components/widgets/popLabels.vue";
import "highlight.js/styles/tomorrow.css";
export default Vue.extend({
  scrollToTop: true,
  components: {
    PostItem,
    BlogIntro,
    ArticleCalendar,
    PopArticles,
    PopLabels
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
      settings: this.$store.state.settings,
      posts: [] as Array<IPost>,
      isLoading: false,
      hasNext: false,
      count: 0,
      sortBy: "date",
      keyword: "" as Array<string> | string,
      filterType: "text",
      inputTxt: "",
      inputDateMoment: [] as Array<Moment>,
      page: 1,
      pageSize: this.$store.state.settings.postPageSize,
      alertShow: false,
      defaultRange: [moment().subtract(30, "days"), moment()],
      rangeDate: {
        今天: [moment(), moment()],
        昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        最近一周: [moment().subtract(7, "days"), moment()],
        最近一个月: [moment().subtract(30, "days"), moment()],
        最近一年: [moment().subtract(365, "days"), moment()]
      }
    };
  },
  created() {
    this.isLoading = true;
    this.getPosts();
  },
  computed: {
    searchPhd(): string {
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
    },
    inputDate(): Array<string> {
      const range = this.inputDateMoment;
      if (!range.length) {
        return [];
      }
      return [
        range[0].startOf("day").toString(),
        range[1].endOf("day").toString()
      ];
    }
  },
  methods: {
    disabledDate(date) {
      return date && date > moment().endOf("day");
    },
    async getPosts() {
      this.isLoading = true;
      const { code, data }: IResp = await this.$axios.$get("/api/posts", {
        params: {
          category: this.category._id,
          pageIndex: this.page,
          pageSize: this.pageSize,
          filterType: this.filterType,
          keyword: this.keyword,
          sortBy: this.sortBy
        }
      });

      if (code === 1) {
        this.posts.push(...data.postList);
        this.hasNext = data.hasNext;
        this.count = data.count;
      }
      this.isLoading = false;
    },
    loadNext() {
      this.page++;
      this.getPosts();
    },
    filterTypeChange() {
      if (this.filterType !== "date") {
        this.$nextTick(() => {
          (this.$refs.inputComp as any).focus();
        });
      }
    },
    async search(checkKeyword = true) {
      let input: Array<string> | string;
      if (this.filterType === "date") {
        input = this.inputDate;
        if (checkKeyword && !input[0] && !input[1]) {
          return;
        }
      } else {
        input = this.inputTxt;
        if (checkKeyword && !input) {
          (this.$refs.inputComp as any).focus();
          return;
        }
      }
      this.alertShow = false;
      this.posts = [];
      this.page = 1;
      this.hasNext = false;
      this.keyword = input;
      await this.getPosts();
      if (input) {
        this.alertShow = true;
      }
    },
    clearSearch() {
      this.alertShow = false;
      this.posts = [];
      this.page = 1;
      this.hasNext = false;
      this.keyword = "";
      this.inputTxt = "";
      this.inputDateMoment = [];
      this.getPosts();
    },
    async sortList(sortBy) {
      if (this.sortBy === sortBy) {
        return;
      }
      this.sortBy = sortBy;
      this.search(false);
    },
    selectCalendar(inputDateMoment: [Moment, Moment]) {
      this.filterType = "date";
      this.inputDateMoment = inputDateMoment;
      this.search();
    }
  }
});
</script>
<style>
.post-wrap {
  padding: 30px 20px 0 280px;
  display: flex;
}

.post-left {
  border-color: #e7eaec;
  border-style: solid solid none;
  border-width: 1px 0;
  overflow: hidden;
  flex: 1;
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
  font-weight: 500;
}

.post-right {
  width: 300px;
  margin-left: 15px;
}

.ant-fullcalendar table,
.ant-fullcalendar th {
  background: #fff !important;
  border: 0 !important;
}

.widget-container {
  border: 1px solid #e7eaec;
  border-radius: 5px;
  background: #fff;
  margin-bottom: 15px;
}

.widget-header {
  padding: 0 15px;
  line-height: 45px;
  border-bottom: 1px solid #e7eaec;
  user-select: none;
}

.widget-body {
  padding: 15px;
  min-height: 100px;
  position: relative;
}

.widget-body .ant-spin {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -10px;
}
</style>
