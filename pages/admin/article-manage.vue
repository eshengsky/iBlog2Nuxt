<template>
  <div>
    <div class="page-header">文章管理</div>
    <div class="page-body">
      <div class="filter-wrap">
        <a-form v-model="filters">
          <a-row>
            <a-col :xs="24" :sm="24" :md="10">
              <a-form-item label="分类" :colon="false">
                <a-select v-model="filters.category" allowClear>
                  <a-select-option
                    v-for="(item, index) in categories"
                    :value="item._id"
                    :key="index"
                    >{{ item.cateName }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="{ span: 10, offset: 2 }">
              <a-form-item label="标题" :colon="false">
                <a-input
                  placeholder="标题关键字"
                  v-model="filters.title"
                  allowClear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs="24" :sm="24" :md="10">
              <a-form-item label="全文" :colon="false">
                <a-input
                  placeholder="全文关键字"
                  v-model="filters.content"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="{ span: 10, offset: 2 }">
              <a-form-item label="标签" :colon="false">
                <a-input
                  placeholder="标签关键字"
                  v-model="filters.label"
                  allowClear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs="24" :sm="24" :md="10">
              <a-form-item label="创建日期" :colon="false">
                <a-range-picker
                  v-model="filters.createTimeMoment"
                  :disabledDate="disabledDate"
                  :ranges="rangeDate"
                  :defaultPickerValue="defaultRange"
                ></a-range-picker>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="24" :md="{ span: 10, offset: 2 }">
              <a-form-item label="修改日期" :colon="false">
                <a-range-picker
                  v-model="filters.modifyTimeMoment"
                  :disabledDate="disabledDate"
                  :ranges="rangeDate"
                  :defaultPickerValue="defaultRange"
                ></a-range-picker>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs="24" :sm="11" :md="4">
              <a-form-item label="是否外链" :colon="false">
                <a-select v-model="filters.isLink" allowClear>
                  <a-select-option value="1">是</a-select-option>
                  <a-select-option value="-1">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :xs="24"
              :sm="{ span: 11, offset: 2 }"
              :md="{ span: 4, offset: 2 }"
            >
              <a-form-item label="是否草稿" :colon="false">
                <a-select v-model="filters.isDraft" allowClear>
                  <a-select-option value="1">是</a-select-option>
                  <a-select-option value="-1">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="11" :md="{ span: 4, offset: 2 }">
              <a-form-item label="是否有评论" :colon="false">
                <a-select v-model="filters.hasComments" allowClear>
                  <a-select-option value="1">是</a-select-option>
                  <a-select-option value="-1">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :xs="24"
              :sm="{ span: 11, offset: 2 }"
              :md="{ span: 4, offset: 2 }"
            >
              <a-form-item label="是否已删除" :colon="false">
                <a-select v-model="filters.isDeleted" allowClear>
                  <a-select-option value="1">是</a-select-option>
                  <a-select-option value="-1">否</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center">
            <a-col>
              <a-button type="primary" @click="search">
                <font-awesome-icon
                  :icon="['fas', 'search']"
                  style="margin-right: 4px;"
                ></font-awesome-icon
                >搜索
              </a-button>
              <a-button @click="reset">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div class="data-wrap">
        <div class="btn-wrap">
          <a-button type="error" :disabled="delDisabled" @click="delAll">
            <span>删除</span>
            <a-badge :count="selectedRowKeys.length" class="badge-count" />
            <span v-show="selectedRowKeys.length">项</span>
          </a-button>
          <a-button href="/admin/article-edit" type="dashed">
            <font-awesome-icon
              :icon="['fas', 'plus']"
              style="margin-right: 4px;"
            ></font-awesome-icon
            >新的文章
          </a-button>
        </div>

        <a-table
          :dataSource="postList"
          :columns="tableColumns"
          :pagination="pagination"
          rowKey="_id"
          :loading="isLoading"
          :scroll="{ x: 1300 }"
          :rowSelection="rowSelection"
          @change="onTableChange"
        >
          <template slot="category" slot-scope="category">
            <a
              class="link-category"
              :href="`/blog/${category.alias}`"
              target="_blank"
              :title="category.cateName"
              >{{ category.cateName }}</a
            >
          </template>
          <template slot="title1" slot-scope="title, row">
            <a
              class="link-title"
              :class="{ 'title-deleted': !row.isActive }"
              :href="`/blog/${row.category.alias}/${row.alias}`"
              target="_blank"
              :title="row.title"
              >{{ row.title }}</a
            >
          </template>
          <template slot="tags" slot-scope="text, row">
            <a-tag
              color="volcano"
              v-if="!row.isActive"
              title="已删除，所有人不可见，可恢复"
              >已删除</a-tag
            >
            <a-tag
              color="green"
              v-else-if="!row.isDraft"
              title="已发布，所有人可见"
              >已发布</a-tag
            >
            <a-tag color="purple" v-else title="草稿，仅自己可见">草稿</a-tag>
          </template>
          <template slot="action" slot-scope="text, row">
            <div class="action-td">
              <template v-if="row.isActive">
                <a-button
                  :href="`/admin/article-edit?uid=${row._id}`"
                  title="编辑"
                >
                  <font-awesome-icon
                    :icon="['fas', 'pencil-alt']"
                  ></font-awesome-icon>
                </a-button>
                <a-button @click="del(row._id)" title="删除">
                  <font-awesome-icon
                    :icon="['fas', 'times']"
                  ></font-awesome-icon>
                </a-button>
              </template>
              <template v-else>
                <a-button @click="undo(row._id)" title="恢复">
                  <font-awesome-icon
                    :icon="['fas', 'undo']"
                  ></font-awesome-icon>
                </a-button>
                <a-button @click="del2(row._id)" title="永久删除">
                  <font-awesome-icon
                    :icon="['far', 'trash-alt']"
                  ></font-awesome-icon>
                </a-button>
              </template>
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { IResp } from "@/server/types";
import moment, { Moment } from "moment";
export default Vue.extend({
  name: "PageArticleManage",
  layout: "admin",
  data() {
    return {
      filters: {
        category: "",
        title: "",
        content: "",
        label: "",
        createTimeMoment: [],
        modifyTimeMoment: [],
        isLink: "",
        isDraft: "",
        hasComments: "",
        isDeleted: ""
      },
      categories: [],
      rangeDate: {
        今天: [moment(), moment()],
        昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        最近一周: [moment().subtract(7, "days"), moment()],
        最近一个月: [moment().subtract(30, "days"), moment()],
        最近一年: [moment().subtract(365, "days"), moment()]
      },
      defaultRange: [moment().subtract(30, "days"), moment()],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "50"],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} 条，共 ${total} 条`
      },
      sortBy: "modifyTime",
      order: "descend",
      postList: [],
      isLoading: false,
      selectedRowKeys: [],
      tableColumns: [
        {
          title: "状态",
          key: "tags",
          width: 90,
          align: "center",
          scopedSlots: { customRender: "tags" }
        },
        {
          title: "分类",
          dataIndex: "category",
          width: 150,
          scopedSlots: { customRender: "category" }
        },
        {
          title: "标题",
          dataIndex: "title",
          sorter: true,
          scopedSlots: { customRender: "title1" }
        },
        {
          title: "创建时间",
          dataIndex: "createTimeStr",
          width: 150,
          align: "center",
          sorter: true
        },
        {
          title: "修改时间",
          dataIndex: "modifyTimeStr",
          width: 150,
          align: "center",
          sorter: true
        },
        {
          title: "浏览次数",
          dataIndex: "viewCount",
          width: 120,
          align: "center",
          sorter: true
        },
        {
          title: "操作",
          key: "action",
          width: 130,
          align: "center",
          fixed: "right",
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },

  created() {
    this.getCategories();
    this.getList();
  },

  computed: {
    rowSelection(): object {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: selectedRowKeys => {
          this.selectedRowKeys = selectedRowKeys;
        },
        getCheckboxProps: record => ({
          props: {
            disabled: !record.isActive,
            checked: false
          }
        })
      };
    },
    startDate() {
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return start;
    },
    delDisabled(): boolean {
      return this.selectedRowKeys.length === 0;
    },
    createTime(): Array<string> {
      const range: Array<Moment> = this.filters.createTimeMoment;
      if (!range.length) {
        return [];
      }
      return [
        range[0].startOf("day").toString(),
        range[1].endOf("day").toString()
      ];
    },
    modifyTime(): Array<string> {
      const range: Array<Moment> = this.filters.modifyTimeMoment;
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
    async getCategories() {
      const { code, data }: IResp = await this.$axios.$get(
        "/admin/api/categories"
      );
      if (code === 1) {
        this.categories = data;
      }
    },
    search() {
      this.pagination.current = 1;
      this.getList();
    },
    async getList() {
      this.selectedRowKeys = [];
      this.isLoading = true;
      const { code, data }: IResp = await this.$axios.$get("/admin/api/posts", {
        params: {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize,
          sortBy: this.sortBy,
          order: this.order,
          createTime: this.createTime,
          modifyTime: this.modifyTime,
          ...this.filters
        }
      });
      if (code === 1) {
        this.postList = data.postList;
        this.pagination.total = data.count;
      } else {
        this.$message.error("请求失败！");
      }
      this.isLoading = false;
    },

    onTableChange(pagination, filters, sorter) {
      this.pagination = pagination;
      this.sortBy = "modifyTime";
      this.order = "descend";
      if (Object.keys(sorter).length) {
        this.sortBy = sorter.columnKey;
        if (sorter.columnKey === "createTimeStr") {
          this.sortBy = "createTime";
        } else if (sorter.columnKey === "modifyTimeStr") {
          this.sortBy = "modifyTime";
        }
        this.order = sorter.order;
      }
      this.getList();
    },

    reset() {
      this.filters.category = "";
      this.filters.title = "";
      this.filters.content = "";
      this.filters.label = "";
      this.filters.createTimeMoment = [];
      this.filters.modifyTimeMoment = [];
      this.filters.isLink = "";
      this.filters.isDraft = "";
      this.filters.hasComments = "";
      this.filters.isDeleted = "";
    },

    del(uid) {
      const self = this;
      this.$confirm({
        title: "确定要删除吗？",
        content: "文章将变成已删除状态，你可以随时恢复。",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          return new Promise((resolve, reject) => {
            self.$axios
              .$delete("/admin/api/article", {
                params: {
                  uids: uid
                }
              })
              .then(resp => {
                if (resp.code === 1) {
                  self.pagination.current = 1;
                  self.getList().then(resolve);
                  self.$message.success("删除成功！");
                } else {
                  console.error(resp.message);
                  reject();
                  self.$message.error("操作失败！");
                }
              });
          });
        }
      });
    },
    delAll() {
      const self = this;
      this.$confirm({
        title: `确定要删除这${self.selectedRowKeys.length}项吗？`,
        content: "文章将变成已删除状态，你可以随时恢复。",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          return new Promise((resolve, reject) => {
            self.$axios
              .$delete("/admin/api/article", {
                params: {
                  uids: self.selectedRowKeys
                }
              })
              .then(resp => {
                if (resp.code === 1) {
                  self.pagination.current = 1;
                  self.getList().then(resolve);
                  self.$message.success("删除成功！");
                } else {
                  console.error(resp.message);
                  reject();
                  self.$message.error("操作失败！");
                }
              });
          });
        }
      });
    },
    del2(uid) {
      const self = this;
      this.$confirm({
        title: "确定要永久删除吗？",
        content: "文章将被永久删除，删除后不可恢复！",
        okText: "确定",
        cancelText: "取消",
        class: "del2",
        onOk() {
          return new Promise((resolve, reject) => {
            self.$axios
              .$delete("/admin/api/article", {
                params: {
                  uids: uid,
                  force: true
                }
              })
              .then(resp => {
                if (resp.code === 1) {
                  self.pagination.current = 1;
                  self.getList().then(resolve);
                  self.$message.success("删除成功！");
                } else {
                  console.error(resp.message);
                  reject();
                  self.$message.error("操作失败！");
                }
              });
          });
        }
      });
    },
    undo(uid) {
      const self = this;
      this.$confirm({
        title: "确定要恢复文章吗？",
        content: "文章将变成草稿状态，你需要手动进行发布。",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          return new Promise((resolve, reject) => {
            self.$axios
              .$put(
                "/admin/api/article",
                {
                  isActive: true,
                  isDraft: true
                },
                {
                  params: {
                    uid
                  }
                }
              )
              .then(resp => {
                if (resp.code === 1) {
                  self.pagination.current = 1;
                  self.getList().then(resolve);
                  self.$message.success("恢复成功！");
                } else {
                  console.error(resp.message);
                  reject();
                  self.$message.error("操作失败！");
                }
              });
          });
        }
      });
    }
  }
});
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

.action-td .ant-btn {
  width: 32px;
  padding: 0;
}

.badge-count {
  top: -2px;
}

.badge-count sup {
  background: #fff;
  padding: 0;
  color: #666;
  font-weight: bold;
  min-width: 12px;
}

.btn-wrap {
  margin-bottom: 10px;
}

.data-wrap .ant-table-body {
  overflow-x: auto !important;
}

.link-category {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  max-width: 150px;
  display: inline-block;
}

.link-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  max-width: 400px;
  display: inline-block;
}

.link-title.title-deleted {
  text-decoration: line-through;
}

.data-wrap .ant-tag {
  margin-right: 0;
}

.del2 .ant-modal-confirm-content {
  color: #fa541c;
}
</style>
