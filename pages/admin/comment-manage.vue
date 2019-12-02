<template>
  <div>
    <div class="page-header">评论管理</div>
    <div class="page-body">
      <div class="filter-wrap">
        <a-form :form="form" :selfUpdate="true">
          <a-row>
            <a-col :sm="24" :md="11" :xxl="5">
              <a-form-item label="评论内容" :colon="false">
                <a-input
                  placeholder="内容关键字"
                  v-decorator="['content']"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col
              :sm="24"
              :md="{ span: 11, offset: 2 }"
              :xxl="{ span: 5, offset: 1 }"
            >
              <a-form-item label="评论用户" :colon="false">
                <a-input
                  placeholder="用户名关键字"
                  v-decorator="['username']"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :sm="24" :md="11" :xxl="{ span: 6, offset: 1 }">
              <a-form-item label="评论时间" :colon="false">
                <a-range-picker
                  v-decorator="['createTime', createTimeOpts]"
                  :disabledDate="disabledDate"
                  :ranges="rangeDate"
                  :defaultPickerValue="defaultRange"
                ></a-range-picker>
              </a-form-item>
            </a-col>
            <a-col
              :sm="24"
              :md="{ span: 11, offset: 2 }"
              :xxl="{ span: 5, offset: 1 }"
            >
              <a-form-item label="所在文章" :colon="false">
                <a-input
                  placeholder="标题关键字"
                  v-decorator="['title']"
                  allowClear
                />
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
        </div>
        <a-table
          :dataSource="comments"
          :columns="tableColumns"
          :pagination="pagination"
          rowKey="_id"
          :loading="isLoading"
          :scroll="{ x: 1000 }"
          :rowSelection="rowSelection"
          @change="onTableChange"
        >
          <template slot="content" slot-scope="text, row">
            <div class="comment-body">
              <tui-editor-viewer :value="row.content" />
            </div>
          </template>
          <template slot="post" slot-scope="post">
            <a
              class="link-title"
              :class="{ 'title-deleted': !post.isActive }"
              :href="`/blog/${post.category.alias}/${post.alias}`"
              target="_blank"
              :title="post.title"
              >{{ post.title }}</a
            >
          </template>
          <template slot="person" slot-scope="text, row">
            <a
              v-if="row.website"
              class="comment-username"
              :href="row.website"
              :title="row.website"
              target="_blank"
              >{{ row.username }}</a
            >
            <span v-else>{{ row.username }}</span>
          </template>
          <template slot="createTime" slot-scope="text, row">
            <span>{{ row.createTime | toDate }}</span>
          </template>
          <template slot="action" slot-scope="text, row">
            <div class="action-td">
              <a-button @click="del(row._id)" title="删除">
                <font-awesome-icon
                  :icon="['far', 'trash-alt']"
                ></font-awesome-icon>
              </a-button>
            </div>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment, { Moment } from "moment";
import { IResp } from "@/server/types";
import { FieldDecoratorOptions } from "ant-design-vue/types/form/form";
export default Vue.extend({
  name: "PageCommentManage",
  layout: "admin",
  data() {
    return {
      form: this.$form.createForm(this),
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "30", "50"],
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} 条，共 ${total} 条`
      },
      sortBy: "createTime",
      order: "descend",
      comments: [],
      isLoading: false,
      selectedRowKeys: [],
      rangeDate: {
        今天: [moment(), moment()],
        昨天: [moment().subtract(1, "days"), moment().subtract(1, "days")],
        最近一周: [moment().subtract(7, "days"), moment()],
        最近一个月: [moment().subtract(30, "days"), moment()],
        最近一年: [moment().subtract(365, "days"), moment()]
      },
      defaultRange: [moment().subtract(30, "days"), moment()],
      tableColumns: [
        {
          title: "评论内容",
          key: "content",
          class: "aaa",
          scopedSlots: { customRender: "content" }
        },
        {
          title: "所在文章",
          dataIndex: "post",
          width: 400,
          scopedSlots: { customRender: "post" }
        },
        {
          title: "评论用户",
          key: "person",
          width: 180,
          scopedSlots: { customRender: "person" }
        },
        {
          title: "评论时间",
          key: "createTime",
          width: 170,
          align: "center",
          sorter: true,
          scopedSlots: { customRender: "createTime" }
        },
        {
          title: "操作",
          key: "action",
          width: 100,
          align: "center",
          fixed: "right",
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },

  created() {
    this.isLoading = true;
    this.$nextTick(() => {
      this.getComments();
    });
  },

  computed: {
    createTimeOpts(): FieldDecoratorOptions {
      let initialValue: Array<Moment> = [];
      const createTimeParam = this.$route.query.createTime as [string, string];
      if (createTimeParam) {
        initialValue = [moment(createTimeParam[0]), moment(createTimeParam[1])];
      }
      return {
        initialValue
      };
    },
    rowSelection(): object {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: selectedRowKeys => {
          this.selectedRowKeys = selectedRowKeys;
        },
        getCheckboxProps: record => ({
          props: {
            checked: false
          }
        })
      };
    },
    delDisabled(): boolean {
      return this.selectedRowKeys.length === 0;
    }
  },

  methods: {
    disabledDate(date) {
      return date && date > moment().endOf("day");
    },
    search() {
      this.pagination.current = 1;
      this.getComments();
    },

    async getComments() {
      const values = this.form.getFieldsValue();
      const createTimeMomentArr = values.createTime;
      let createTime: string[] | undefined = undefined;
      if (createTimeMomentArr && createTimeMomentArr.length === 2) {
        createTime = [
          createTimeMomentArr[0].startOf("day").toString(),
          createTimeMomentArr[1].endOf("day").toString()
        ];
      }
      this.selectedRowKeys = [];
      this.isLoading = true;
      const { code, data }: IResp = await this.$axios.$get(
        "/admin/api/comments",
        {
          params: {
            pageIndex: this.pagination.current,
            pageSize: this.pagination.pageSize,
            sortBy: this.sortBy,
            order: this.order,
            ...values,
            createTime
          }
        }
      );
      if (code === 1) {
        this.comments = data.comments;
        this.pagination.total = data.count;
      } else {
        this.$message.error("请求失败！");
      }
      this.isLoading = false;
    },

    reset() {
      this.form.setFieldsValue({
        content: "",
        username: "",
        createTime: [],
        title: ""
      });
      this.search();
    },

    onTableChange(pagination, filters, sorter) {
      this.pagination = pagination;
      this.sortBy = "createTime";
      this.order = "descend";
      if (Object.keys(sorter).length) {
        this.order = sorter.order;
      }
      this.getComments();
    },

    del(uid) {
      const self = this;
      this.$confirm({
        title: "确定要删除吗？",
        content: "评论将被永久删除，删除后不可恢复！",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          return new Promise((resolve, reject) => {
            self.$axios
              .$delete("/admin/api/comment", {
                params: {
                  uids: uid
                }
              })
              .then(resp => {
                if (resp.code === 1) {
                  self.pagination.current = 1;
                  self.getComments().then(resolve);
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
        content: "评论将被永久删除，删除后不可恢复！",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          return new Promise((resolve, reject) => {
            self.$axios
              .$delete("/admin/api/comment", {
                params: {
                  uids: self.selectedRowKeys
                }
              })
              .then(resp => {
                if (resp.code === 1) {
                  self.pagination.current = 1;
                  self.getComments().then(resolve);
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
    }
  }
});
</script>

<style>
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

.comment-body {
  width: 100%;
  padding: 12px 15px;
  overflow: visible;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin: -6px;
  background: #fff;
}
</style>
