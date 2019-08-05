<template>
  <div class="post-wrap">
    <div class="post-top">
      <div class="post-top-left">
        <a>日期</a>
        <a>标题</a>
      </div>
      <div class="post-top-right">
        <Select v-model="filterTypeVal" @on-change="filterTypeChange" style="width: 70px">
          <Option value="text">全文</Option>
          <Option value="title">标题</Option>
          <Option value="tag">标签</Option>
          <Option value="date">日期</Option>
        </Select>
        <Input
          v-if="filterTypeVal !== 'date'"
          v-model="inputTxt"
          style="width: 200px"
          :placeholder="searchPhd"
          clearable
          ref="inputComp"
          @on-enter="search"
        ></Input>
        <DatePicker
          v-if="filterTypeVal === 'date'"
          v-model="inputDate"
          type="daterange"
          split-panels
          separator=" ~ "
          placement="bottom-end"
          placeholder="选择日期范围"
          :start-date="startDate"
          :options="dateOpts"
          :editable="false"
          :transfer="true"
          style="width: 200px"
          ref="dateComp"
        ></DatePicker>
        <Button @click="search">搜索</Button>
      </div>
    </div>
    <ul class="post-list" v-if="posts.length > 0">
      <li v-for="item in posts" :key="item._id">
        <post-item :post="item"></post-item>
      </li>
      <li>
        <Button
          class="btn-load"
          @click="loadNext"
          v-if="posts.length > 0 && hasNext"
          :loading="loading"
        >下一页</Button>
        <div class="no-more" v-if="posts.length > 0 && !hasNext">没有更多数据</div>
      </li>
    </ul>
    <div class="first-loading" v-else-if="loading">加载中...</div>
    <div class="no-data" v-else>暂无数据</div>

    <Drawer
      :title="article.title"
      :value="drawer"
      placement="right"
      width="66.66%"
      :closable="false"
      @input="closeDrawer"
    >
      <article class="preview-article" v-html="article.html"></article>
      <footer class="preview-footer">
        <i-button size="large" @click="closeDrawer">关闭</i-button>
        <i-button
          size="large"
          type="primary"
          :to="`/blog/${article.category.alias}/${article.alias}`"
          target="_blank"
        >完整模式</i-button>
      </footer>
    </Drawer>
  </div>
</template>
<script>
import { mapState } from "vuex";
import PostItem from "~/components/PostItem.vue";
import "highlight.js/styles/tomorrow.css";
export default {
  scrollToTop: true,
  components: {
    PostItem
  },
  data() {
    return {
      filterTypeVal: "text",
      inputTxt: "",
      inputDate: "",
      dateOpts: {
        shortcuts: [
          {
            text: "今天发布",
            value() {
              return [new Date(), new Date()];
            }
          },
          {
            text: "本周发布",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "本月发布",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "今年发布",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 12);
              return [start, end];
            }
          },
          {
            text: "全部",
            value() {
              return [];
            }
          }
        ],
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      }
    };
  },
  mounted: function() {
    this.$store.commit("setData", {
      postList: [],
      hasNext: false,
      filterType: "text",
      keyword: ""
    });
    const category = this.$route.params.category || "";
    const findOne = this.$store.state.categoryList.find(
      item => item.alias === category
    );
    if (findOne) {
      this.$store.commit("setData", {
        page: 1,
        cateId: findOne._id
      });
      this.$store.dispatch("getPosts");
    }
  },
  computed: {
    startDate() {
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return start;
    },
    searchPhd() {
      let placeholder = "";
      switch (this.filterTypeVal) {
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
    ...mapState({
      page: state => state.page,
      posts: state => state.postList,
      hasNext: state => state.hasNext,
      loading: state => state.loading,
      drawer: state => state.drawer,
      article: state => state.article
    })
  },
  methods: {
    loadNext() {
      this.$store.commit("setData", {
        page: this.page + 1
      });
      this.$store.dispatch("getPosts");
    },
    closeDrawer() {
      this.$store.commit("setData", {
        drawer: false
      });
    },
    filterTypeChange(val) {
      this.$nextTick(function() {
        if (this.filterTypeVal !== "date") {
          this.$refs.inputComp.focus();
        } else {
          document.querySelector(".ivu-date-picker input").click();
        }
      });
    },
    search() {
      let input = "";
      if (this.filterTypeVal === "date") {
        input = this.inputDate;
      } else {
        input = this.inputTxt;
      }
      this.$store.commit("setData", {
        postList: [],
        page: 1,
        hasNext: false,
        keyword: input,
        filterType: this.filterTypeVal
      });
      this.$store.dispatch("getPosts");
    }
  }
};
</script>
<style>
.post-wrap {
  margin: 30px 0 30px 280px;
  background: #fff;
  border-color: #e7eaec;
  border-style: solid solid none;
  border-width: 1px 0;
  min-height: calc(100vh - 110px);
  position: relative;
  width: 66.66%;
}

.post-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 59px;
  border-bottom: 1px solid #e7eaec;
  padding: 20px;
}

.post-top-left a {
  font-size: 16px;
  color: #999;
  cursor: pointer;
}

.post-top-right {
  display: flex;
}

.post-list {
  padding: 10px 20px 0;
  margin-bottom: 0;
}

.btn-load {
  width: 100%;
  margin-bottom: 20px;
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
  padding-bottom: 20px;
  -webkit-user-select: none;
  user-select: none;
}

.no-data {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin-top: 30px;
  -webkit-user-select: none;
  user-select: none;
}

.ivu-picker-panel-body-wrapper {
  font-size: 14px;
}

.ivu-select-single .ivu-select-selection .ivu-select-placeholder,
.ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  font-size: 14px;
  padding-left: 12px;
}

.ivu-select-visible .ivu-select-selection,
.ivu-select-selection-focused,
.ivu-select-selection:hover {
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

.ivu-input {
  border-radius: 0;
  font-size: 13px;
}

.ivu-input:hover,
.ivu-input:focus {
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

.ivu-date-picker-focused input {
  border-color: #dcdee2;
  box-shadow: none;
}

.ivu-icon-ios-close-circle,
.ivu-input-suffix i.ivu-icon-ios-close-circle {
  color: #999;
}
</style>