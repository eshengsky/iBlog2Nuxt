<template>
  <div>
    <no-ssr>
      <div class="filter-wrap">
        <Form :label-width="85" v-model="filters">
          <Row>
            <Col :xs="24" :sm="24" :md="12">
              <FormItem label="分类">
                <Select v-model="filters.cateId" clearable>
                  <Option
                    v-for="(item, index) in categories"
                    :value="item._id"
                    :key="index"
                  >{{ item.cateName }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12">
              <FormItem label="标题">
                <Input placeholder="文章标题关键字" v-model="filters.title" clearable />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :xs="24" :sm="24" :md="12">
              <FormItem label="全文">
                <Input placeholder="文章全文关键字" v-model="filters.content" clearable />
              </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12">
              <FormItem label="标签">
                <Input placeholder="文章标签关键字" v-model="filters.label" clearable />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :xs="24" :sm="24" :md="12">
              <FormItem label="发布日期">
                <DatePicker
                  v-model="filters.createTime"
                  type="daterange"
                  split-panels
                  separator=" ~ "
                  placement="bottom-end"
                  placeholder="选择日期范围"
                  style="width: 100%;"
                  :start-date="startDate"
                  :options="dateOpts"
                  :editable="false"
                  :transfer="true"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="24" :md="12">
              <FormItem label="修改日期">
                <DatePicker
                  v-model="filters.modifyTime"
                  type="daterange"
                  split-panels
                  separator=" ~ "
                  placement="bottom-end"
                  placeholder="选择日期范围"
                  style="width: 100%;"
                  :start-date="startDate"
                  :options="dateOpts"
                  :editable="false"
                  :transfer="true"
                ></DatePicker>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :xs="24" :sm="12" :md="6">
              <FormItem label="是否外链">
                <Select v-model="filters.isLink" clearable>
                  <Option value="1">是</Option>
                  <Option value="-1">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="6">
              <FormItem label="是否草稿">
                <Select v-model="filters.isDraft" clearable>
                  <Option value="1">是</Option>
                  <Option value="-1">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="6">
              <FormItem label="是否有评论">
                <Select v-model="filters.hasComments" clearable>
                  <Option value="1">是</Option>
                  <Option value="-1">否</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="6">
              <FormItem label="是否已删除">
                <Select v-model="filters.isDeleted" clearable>
                  <Option value="1">是</Option>
                  <Option value="-1">否</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col>
              <Button type="primary" @click="getList">
                <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
                <span>搜索</span>
              </Button>
              <Button @click="reset">重置</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div class="data-wrap">
        <div class="btn-wrap">
          <Button type="error" :disabled="delDisabled">
            <font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>
            <span class="badge-count" v-show="!delDisabled">{{ selection.length }}</span>
          </Button>
          <Button to="/admin/article">
            <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
            <span>新的文章</span>
          </Button>
        </div>

        <Table
          :data="postList"
          :columns="tableColumns"
          :loading="isLoading"
          stripe
          @on-sort-change="changeSort"
          @on-selection-change="changeSelect"
        >
          <template slot-scope="{ row }" slot="category">
            <a :href="`/blog/${row.category.alias}`" target="_blank">{{ row.category.cateName }}</a>
          </template>
          <template slot-scope="{ row }" slot="title">
            <a :href="`/blog/${row.category.alias}/${row.alias}`" target="_blank">{{ row.title }}</a>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button>
              <font-awesome-icon :icon="['fas', 'pencil-alt']"></font-awesome-icon>
            </Button>
            <Button>
              <font-awesome-icon :icon="['far', 'trash-alt']"></font-awesome-icon>
            </Button>
          </template>
        </Table>
        <div class="page-wrap">
          <Page
            :total="total"
            show-total
            show-sizer
            :page-size="pageSize"
            :page-size-opts="[3, 10, 20, 30, 50]"
            @on-change="changePage"
            @on-page-size-change="changeSize"
          ></Page>
        </div>
      </div>
    </no-ssr>
  </div>
</template>
<script lang="ts">
import { IResp } from "@/server/types";
export default {
  name: "PageAdminIndex",
  layout: "admin",
  data() {
    return {
      filters: {
        cateId: "",
        title: "",
        content: "",
        label: "",
        createTime: "",
        modifyTime: "",
        isLink: "",
        isDraft: "",
        hasComments: "",
        isDeleted: ""
      },
      categories: [],
      dateOpts: {
        shortcuts: [
          {
            text: "今天",
            value() {
              return [new Date(), new Date()];
            }
          },
          {
            text: "本周",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "本月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "今年",
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
      },
      page: 1,
      pageSize: 3,
      sortBy: "modifyTime",
      order: "desc",
      postList: [],
      total: 0,
      isLoading: false,
      selection: [],
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "分类",
          slot: "category",
          minWidth: 150
        },
        {
          title: "标题",
          slot: "title",
          key: "title",
          sortable: "custom",
          minWidth: 300
        },
        {
          title: "发布时间",
          key: "createTimeStr",
          width: 150,
          align: "center",
          sortable: "custom"
        },
        {
          title: "修改时间",
          key: "modifyTimeStr",
          width: 150,
          align: "center",
          sortable: "custom"
        },
        {
          title: "浏览次数",
          key: "viewCount",
          width: 120,
          align: "center",
          sortable: "custom"
        },
        {
          title: "操作",
          slot: "action",
          width: 130,
          align: "center",
          className: "action-td",
          fixed: "right"
        }
      ]
    };
  },

  created() {
    this.getCategories();
    this.getList();
  },

  computed: {
    startDate() {
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return start;
    },
    delDisabled() {
      return this.selection.length === 0;
    }
  },

  methods: {
    async getCategories() {
      const { code, data }: IResp = await this.$axios.$get(
        "/admin/api/categories"
      );
      if (code === 1) {
        this.categories = data;
      }
    },
    async getList() {
      this.selection = [];
      this.isLoading = true;
      const { code, data }: IResp = await this.$axios.$get("/admin/api/posts", {
        params: {
          pageIndex: this.page,
          pageSize: this.pageSize,
          sortBy: this.sortBy,
          order: this.order,
          ...this.filters
        }
      });
      if (code === 1) {
        this.postList = data.postList;
        this.total = data.count;
      } else {
        this.$Message.error({
          background: true,
          content: "请求失败！"
        });
      }
      this.isLoading = false;
    },

    changePage(pageIndex: number) {
      this.page = pageIndex;
      this.getList();
    },

    changeSize(pageSize: number) {
      this.pageSize = pageSize;
      this.getList();
    },

    changeSort({ key, order }: { key: string; order: string }) {
      let sortBy = key;
      if (key === "createTimeStr") {
        sortBy = "createTime";
      } else if (key === "modifyTimeStr") {
        sortBy = "modifyTime";
      }
      this.sortBy = sortBy;
      this.order = order;
      this.getList();
    },

    changeSelect(selection) {
      this.selection = selection;
    },

    reset() {
      this.filters.cateId = "";
      this.filters.title = "";
      this.filters.content = "";
      this.filters.label = "";
      this.filters.createTime = "";
      this.filters.modifyTime = "";
      this.filters.isLink = "";
      this.filters.isDraft = "";
      this.filters.hasComments = "";
      this.filters.isDeleted = "";
    }
  }
};
</script>
<style>
.filter-wrap {
  max-width: 800px;
  margin: 10px auto 20px;
}

.page-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.action-td button {
  width: 36px;
  padding: 0;
}

.badge-count {
  border-radius: 30px;
  padding: 0 5px;
  background: #fff;
  color: #ed4014;
  font-weight: bold;
  font-size: 12px;
  line-height: 2;
}

.btn-wrap {
  margin-bottom: 10px;
}
</style>