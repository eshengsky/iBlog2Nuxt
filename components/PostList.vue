<template>
  <div class="post-wrap">
    <div class="post-top">
      <div class="post-top-left">
        <a>日期</a>
        <a>标题</a>
      </div>
      <div class="post-top-right">
        <Select :value="filterType" @on-change="filterTypeChange" style="width: 70px">
          <Option value="text">全文</Option>
          <Option value="title">标题</Option>
          <Option value="tag">标签</Option>
          <Option value="date">日期</Option>
        </Select>
        <Input
          v-if="filterType !== 'date'"
          style="width: 200px"
          :placeholder="searchPhd"
          clearable
          ref="inputComp"
        ></Input>
        <DatePicker
          v-if="filterType === 'date'"
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
        <Button>搜索</Button>
      </div>
    </div>
    <ul class="post-list" v-if="posts.length > 0">
      <li v-for="item in posts" :key="item._id">
        <post-item :post="item"></post-item>
      </li>
    </ul>
    <div class="no-more" v-else>暂无数据</div>

    <Button
      class="btn-load"
      @click="loadNext"
      v-if="posts.length > 0 && hasNext"
      :loading="loading"
    >下一页</Button>
    <div class="no-more" v-if="posts.length > 0 && !hasNext">没有更多数据</div>

    <Drawer
      :title="article.title"
      :value="drawer"
      placement="right"
      width="60%"
      :closable="false"
      @input="closeDrawer"
    >
      <article class="preview-article" v-html="article.html"></article>
      <footer class="preview-footer">
        <i-button @click="closeDrawer">关闭</i-button>
        <i-button
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
      dateOpts: {
        shortcuts: [
          {
            text: "今天的文章",
            value() {
              return [new Date(), new Date()];
            }
          },
          {
            text: "本周的文章",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "本月的文章",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "今年的文章",
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
      key: "postList",
      value: []
    });
    const category = this.$route.params.category || "";
    const findOne = this.$store.state.categoryList.find(
      item => item.alias === category
    );
    if (findOne) {
      this.$store.commit("setData", {
        key: "page",
        value: 1
      });
      this.$store.commit("setData", {
        key: "cateId",
        value: findOne._id
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
    ...mapState({
      page: state => state.page,
      posts: state => state.postList,
      hasNext: state => state.hasNext,
      loading: state => state.loading,
      drawer: state => state.drawer,
      article: state => state.article,
      filterType: state => state.filterType
    })
  },
  methods: {
    loadNext() {
      this.$store.commit("setData", {
        key: "page",
        value: this.page + 1
      });
      this.$store.dispatch("getPosts");
    },
    closeDrawer() {
      this.$store.commit("setData", {
        key: "drawer",
        value: false
      });
    },
    filterTypeChange(val) {
      this.$store.commit("setData", {
        key: "filterType",
        value: val
      });
      this.$nextTick(function() {
        if (this.filterType !== "date") {
          this.$refs.inputComp.focus();
        } else {
          document.querySelector('.ivu-date-picker input').click();
        }
      });
    }
  }
};
</script>
<style>
.post-wrap {
  margin: 30px 0 0;
  margin-left: 280px;
  background: #fff;
  border-color: #e7eaec;
  border-style: solid solid none;
  border-width: 1px 0;
  min-height: 64px;
  position: relative;
  width: 66.66%;
  height: calc(100vh - 70px);
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
  padding: 10px 20px;
}

.btn-load {
  width: 100%;
}

.ivu-drawer-header-inner {
  font-size: 18px;
  line-height: 18px;
  padding: 0 10px;
  color: #333;
}

.ivu-drawer-body {
  height: calc(100% - 51px - 54px);
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
  line-height: 34px;
}

.ivu-picker-panel-body-wrapper {
  font-size: 12px;
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

.ivu-input-icon {
  color: #999;
}
</style>