<template>
  <div class="article-edit">
    <div class="page-header">{{pageHeader}}</div>
    <div class="page-body">
      <a-form :form="form" :selfUpdate="true">
        <div class="title-line">
          <a-form-item label="标题" :colon="false">
            <a-input placeholder="请输入标题" allowClear v-decorator="['title', titleOpts]" />
          </a-form-item>
          <a-form-item label="分类" :colon="false">
            <a-select v-decorator="['category', categoryOpts]">
              <a-select-option
                v-for="(item, index) in categories"
                :value="item._id"
                :key="index"
              >{{ item.cateName }}</a-select-option>
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0;" />
                <a href="/admin/category-manage" target="_blank" class="link-category">
                  <font-awesome-icon :icon="['fas', 'plus']" style="margin-right: 4px;"></font-awesome-icon>新的分类
                </a>
              </div>
            </a-select>
          </a-form-item>
        </div>
        <a-form-item :colon="false">
          <span slot="label">
            Alias
            <a-tooltip title="文章别名，如：this-is-my-fist-post，将作为URL的一部分">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input placeholder="请输入Alias" v-decorator="['alias', aliasOpts]" allowClear>
            <a-icon slot="suffix" type="info-circle" />
          </a-input>
        </a-form-item>
        <a-form-item label="摘要" :colon="false">
          <a-textarea
            v-decorator="['summary', summaryOpts]"
            placeholder="请输入摘要"
            :rows="2"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item>
        <a-form-item label="来源" :colon="false">
          <a-radio-group
            name="radioGroup"
            v-decorator="['isLocal', isLocalOpts]"
            @change="isLocalChange"
          >
            <a-radio :value="true">本地</a-radio>
            <a-radio :value="false">外链</a-radio>
          </a-radio-group>
        </a-form-item>
        <div v-show="!isLocal">
          <a-form-item label="URL" :colon="false">
            <a-input
              placeholder="请输入链接地址"
              ref="urlInputComp"
              v-decorator="['url', urlOpts]"
              allowClear
            />
          </a-form-item>
        </div>
        <div v-show="isLocal">
          <a-form-item label="正文" :colon="false">
            <div class="editor-wrap">
              <client-only>
                <tui-editor
                  v-model="content"
                  ref="editor"
                  previewStyle="vertical"
                  height="70vh"
                  :options="editorOptions"
                />
              </client-only>
              <div class="editor-footer">
                <a-tooltip>
                  <template slot="title">打开Markdown语法速查</template>
                  <a @click="mcsShow = true">
                    <font-awesome-icon :icon="['fab', 'markdown']" style="font-size: 14px"></font-awesome-icon>
                    <span>支持Markdown语法</span>
                  </a>
                </a-tooltip>
              </div>
            </div>
          </a-form-item>
          <a-form-item label="标签" :colon="false">
            <a-select
              v-decorator="['labels', labelsOpts]"
              mode="tags"
              placeholder="回车新增"
              notFoundContent
            ></a-select>
          </a-form-item>
        </div>
        <div>
          <template v-if="!initialData._id">
            <a-button type="primary" @click="publish">
              <font-awesome-icon :icon="['far', 'paper-plane']" style="margin-right: 4px;"></font-awesome-icon>发布文章
            </a-button>
            <a-button @click="saveDraft">
              <font-awesome-icon :icon="['far', 'file-alt']" style="margin-right: 4px;"></font-awesome-icon>存为草稿
            </a-button>
          </template>
          <template v-else>
            <template v-if="initialData.isDraft">
              <a-button type="primary" @click="publish2">
                <font-awesome-icon :icon="['far', 'paper-plane']" style="margin-right: 4px;"></font-awesome-icon>发布文章
              </a-button>
              <a-button @click="save">
                <font-awesome-icon :icon="['far', 'save']" style="margin-right: 4px;"></font-awesome-icon>保存更改
              </a-button>
            </template>
            <template v-else>
              <a-button type="primary" @click="save">
                <font-awesome-icon :icon="['far', 'save']" style="margin-right: 4px;"></font-awesome-icon>保存更改
              </a-button>
              <a-button @click="unpublish">
                <font-awesome-icon :icon="['fas', 'history']" style="margin-right: 4px;"></font-awesome-icon>取消发布
              </a-button>
            </template>
          </template>
          <a-button @click="back">返回</a-button>
        </div>
      </a-form>
    </div>
    <a-modal v-model="mcsShow" title="Markdown 语法速查" width="640px">
      <md-cheat-sheet></md-cheat-sheet>
      <div slot="footer">
        <a-button type="primary" @click="mcsShow = false">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MdCheatSheet from "@/components/MdCheatSheet.vue";
import { IResp } from "@/server/types";
import { IPost } from "@/server/models/post";
import { otherCategoryItem } from "@/server/models/category";
import "highlight.js/styles/tomorrow.css";
export default Vue.extend({
  name: "PageAdminArticle",
  layout: "admin",
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    },
    MdCheatSheet
  },
  async asyncData({ $axios, query, error }: any) {
    const uid = query.uid;
    if (uid) {
      const { code, data } = await $axios.$get("/admin/api/article", {
        params: {
          uid
        }
      });
      if (code === 1) {
        if (data && data.isActive) {
          return {
            initialData: data
          };
        }
        error({
          statusCode: 404,
          message: "未找到该页面"
        });
      } else {
        error({
          statusCode: 500,
          message: "内部服务器错误"
        });
      }
    }
  },
  data() {
    return {
      initialData: {} as IPost,
      isLocal: true,
      content: "",
      mcsShow: false,
      categories: [],
      titleOpts: {
        rules: [
          {
            required: true,
            message: "标题不能为空！"
          }
        ]
      },
      categoryOpts: {
        initialValue: otherCategoryItem._id.toHexString()
      },
      summaryOpts: {
        initialValue: ""
      },
      isLocalOpts: {
        initialValue: true
      },
      labelsOpts: {
        initialValue: []
      },
      editorOptions: {
        hideModeSwitch: true,
        language: "zh_CN",
        usageStatistics: false,
        placeholder: "请输入文章正文",
        toolbarItems: [
          "heading",
          "bold",
          "italic",
          "strike",
          "divider",
          "hr",
          "quote",
          "divider",
          "ul",
          "ol",
          "task",
          "divider",
          "image",
          "table",
          "link",
          "divider",
          "code",
          "codeblock"
        ],
        exts: ["scrollSync"]
      }
    };
  },
  created() {
    this.getCategories();
  },
  mounted() {
    if (this.initialData._id) {
      // 编辑模式
      this.form.setFieldsValue({
        title: this.initialData.title,
        alias: this.initialData.alias,
        category: this.initialData.category,
        summary: this.initialData.summary,
        isLocal: this.initialData.isLocal,
        url: this.initialData.url || "",
        labels: this.initialData.labels
      });
      this.content = this.initialData.content;
    }
  },
  computed: {
    pageHeader(): string {
      return this.initialData._id ? "编辑文章" : "新增文章";
    },
    form(): any {
      return this.$form.createForm(this);
    },
    aliasOpts(): object {
      return {
        rules: [
          {
            required: true,
            message: "Alias不能为空！"
          },
          {
            validator: this.checkAlias
          }
        ]
      };
    },
    urlOpts(): object {
      return {
        rules: [
          {
            required: !this.isLocal,
            message: "链接地址不能为空！"
          }
        ]
      };
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
    checkAlias(rule, value, callback) {
      if (value) {
        this.$axios
          .$get("/admin/api/checkArticleAlias", {
            params: {
              alias: value,
              excludeUid: this.initialData._id
            }
          })
          .then(({ code, data }: IResp) => {
            if (code === 1 && !data.exists) {
              callback();
            } else {
              callback("alias已存在！");
            }
          });
      } else {
        callback();
      }
    },
    isLocalChange(e) {
      this.isLocal = e.target.value;
      this.$nextTick(() => {
        if (!this.isLocal) {
          this.$refs.urlInputComp.focus();
        }
      });
    },
    publish() {
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          const self = this;
          const data = {
            content: this.content,
            ...values
          };
          this.$confirm({
            title: "确定要发布吗？",
            okText: "确定",
            cancelText: "取消",
            onOk() {
              return new Promise((resolve, reject) => {
                self.$axios.$post("/admin/api/article", data).then(resp => {
                  if (resp.code === 1) {
                    self.initialData = resp.data.article;
                    history.replaceState(
                      null,
                      "",
                      `${location.protocol}//${location.host}${location.pathname}?uid=${self.initialData._id}`
                    );
                    resolve();
                    self.$message.success("文章发布成功！");
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
      });
    },
    publish2() {
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          const self = this;
          const data = {
            content: this.content,
            isDraft: false,
            ...values
          };
          this.$confirm({
            title: "确定要发布吗？",
            okText: "确定",
            cancelText: "取消",
            onOk() {
              return new Promise((resolve, reject) => {
                self.$axios
                  .$put("/admin/api/article", data, {
                    params: {
                      uid: self.initialData._id
                    }
                  })
                  .then(resp => {
                    if (resp.code === 1) {
                      self.initialData = resp.data.article;
                      resolve();
                      self.$message.success("文章发布成功！");
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
      });
    },
    saveDraft() {
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          const self = this;
          const data = {
            content: this.content,
            isDraft: true,
            ...values
          };
          this.$axios.$post("/admin/api/article", data).then(resp => {
            if (resp.code === 1) {
              self.initialData = resp.data.article;
              history.replaceState(
                null,
                "",
                `${location.protocol}//${location.host}${location.pathname}?uid=${self.initialData._id}`
              );
              self.$message.success("新建草稿成功！");
            } else {
              console.error(resp.message);
              self.$message.error("操作失败！");
            }
          });
        }
      });
    },
    back() {
      location.href = "/admin/article-manage";
    },
    unpublish() {
      const self = this;
      this.$confirm({
        title: "确定要取消发布吗？",
        content: "文章将变成草稿状态，只有你自己可见。",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          return new Promise((resolve, reject) => {
            self.$axios
              .$put(
                "/admin/api/article",
                {
                  isDraft: true
                },
                {
                  params: {
                    uid: self.initialData._id
                  }
                }
              )
              .then(resp => {
                if (resp.code === 1) {
                  self.initialData = resp.data.article;
                  resolve();
                  self.$message.success("取消发布成功！");
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
    save() {
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          const self = this;
          const data = {
            content: this.content,
            ...values
          };
          this.$axios
            .$put("/admin/api/article", data, {
              params: {
                uid: this.initialData._id
              }
            })
            .then(resp => {
              if (resp.code === 1) {
                self.$message.success("保存成功！");
              } else {
                console.error(resp.message);
                self.$message.error("操作失败！");
              }
            });
        }
      });
    }
  }
});
</script>

<style>
.link-category {
  display: block;
  padding: 8px 12px;
}

.tui-editor-defaultUI {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  overflow: auto;
}

.tui-editor-defaultUI .te-tab button {
  height: 32px;
}

.tui-editor-defaultUI-toolbar {
  padding: 0 20px;
}

button.tui-scrollsync {
  display: none !important;
}

.tui-editor-contents pre {
  border-radius: 4px;
}

.tui-tooltip {
  max-width: 250px;
  min-height: 34px;
  padding: 8px 12px;
  color: #fff;
  text-align: left;
  text-decoration: none;
  background-color: rgba(70, 76, 91, 0.9);
  border-radius: 4px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  opacity: 1;
}

.tui-tooltip .arrow {
  display: none;
}

.tui-editor-defaultUI-toolbar button:hover,
.tui-editor-defaultUI-toolbar button:active,
.tui-editor-defaultUI-toolbar button.active {
  border-color: #bbb;
  border-radius: 3px;
}

.tui-editor-popup {
  position: fixed;
  top: 50%;
  transform: translate(0, -50%);
  box-shadow: 0px 0px 10px #aaa;
  border-radius: 5px;
}

.editor-footer {
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-color: #e5e5e5;
  border-style: solid;
  border-width: 0 1px 1px;
  align-items: center;
  padding: 2px 10px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  -webkit-user-select: none;
  user-select: none;
}

.title-line {
  display: flex;
}

.title-line .ant-form-item:nth-child(1) {
  flex: 1;
}

.title-line .ant-form-item:nth-child(2) {
  width: 200px;
  margin-left: 10px;
}

.article-edit .tui-editor-defaultUI {
  border: 1px solid #d9d9d9;
}
</style>
