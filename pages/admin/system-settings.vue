<template>
  <div class="system-settings">
    <div class="page-header">系统设置</div>
    <div class="page-body">
      <a-form :form="form" :selfUpdate="true">
        <a-form-item :colon="false">
          <span slot="label">
            博客名称
            <a-tooltip title="显示于网站左上角" placement="topLeft" arrowPointAtCenter>
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input placeholder="请输入博客名称" v-decorator="['blogName', blogNameOpts]" allowClear />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            博客标语
            <a-tooltip title="显示于博客名称的下方，为空则不显示" placement="topLeft" arrowPointAtCenter>
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input placeholder="请输入博客标语" v-decorator="['blogSlogan']" allowClear />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            博客logo
            <a-tooltip title="显示于网站左上角" placement="topLeft" arrowPointAtCenter>
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <div class="img-tip">
            <a-icon type="info-circle" />
            <span>
              你可以在
              <a href="https://www.iconfont.cn/" target="_blank">阿里巴巴矢量图标库</a>
              搜索和下载喜欢的图片作为logo。
            </span>
          </div>
          <a-upload
            v-decorator="['blogLogo']"
            name="blogLogo"
            :showUploadList="false"
            list-type="picture-card"
            :beforeUpload="beforeUpload"
            @change="uploadChange"
            accept="image/*"
          >
            <img v-if="blogLogo" :src="blogLogo" alt="image" />
            <div v-else>
              <a-icon :type="imgLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            显示博客简介
            <a-tooltip title="博客简介展示于首页右侧" placement="topLeft" arrowPointAtCenter>
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-switch v-decorator="['showBlogIntro', { valuePropName: 'checked' }]" />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">博客简介内容</span>
          <a-textarea
            v-decorator="['blogIntro']"
            placeholder="请输入博客简介"
            :rows="2"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item>
        <a-form-item label="首页文章的每页条数" :colon="false">
          <a-input-number v-decorator="['postPageSize', postPageSizeOpts]" :min="1" :max="999" />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            开启预览功能
            <a-tooltip title="点击文章除标题外的其它部分，会弹出预览抽屉" placement="topLeft" arrowPointAtCenter>
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-switch v-decorator="['enablePreview', { valuePropName: 'checked' }]" />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            默认展开文章目录
            <a-tooltip title="进入文章页面后，是否自动展开目录" placement="topLeft" arrowPointAtCenter>
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-switch v-decorator="['expandMenu', { valuePropName: 'checked' }]" />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            显示文章版权信息
            <a-tooltip title="是否显示文章底部的版权信息" placement="topLeft" arrowPointAtCenter>
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-switch v-decorator="['showLicense', { valuePropName: 'checked' }]" />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            版权作者
            <a-tooltip title="文章底部版权信息中显示的作者名称" placement="topLeft" arrowPointAtCenter>
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input placeholder="请输入版权作者" v-decorator="['authName']" allowClear />
        </a-form-item>
        <a-form-item label="文章评论及留言的每页条数" :colon="false">
          <a-input-number v-decorator="['commentPageSize', commentPageSizeOpts]" :min="1" :max="999" />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            显示翻译按钮
            <a-icon type="question-circle-o" />
          </span>
          <a-switch v-decorator="['showTranslateBtn', { valuePropName: 'checked' }]" />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            百度翻译Key
            <a-icon type="question-circle-o" />
          </span>
          <a-input placeholder="请输入百度翻译Key" v-decorator="['translateKey']" allowClear />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            开启百度统计
            <a-tooltip title="启用后将在除后台管理外的其它页面注入百度统计代码" placement="topLeft" arrowPointAtCenter>
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-switch v-decorator="['enableStatistics', { valuePropName: 'checked' }]" />
        </a-form-item>
        <a-form-item :colon="false">
          <span slot="label">
            百度统计Key
            <a-tooltip title="请在百度统计官网 - 管理 - 代码获取页面查看所属站点的key" placement="topLeft" arrowPointAtCenter>
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input placeholder="请输入百度统计Key" v-decorator="['statisticsKey']" allowClear />
        </a-form-item>
      </a-form>
      <div class="btn-wrap">
        <a-button type="primary" @click="save">
          <font-awesome-icon :icon="['far', 'save']" style="margin-right: 4px;"></font-awesome-icon>保存设置
        </a-button>
        <a-button @click="reset">
          <font-awesome-icon :icon="['fas', 'undo']" style="margin-right: 4px;"></font-awesome-icon>恢复默认
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IResp } from "@/server/types";
import { ISetting, defaultSetting } from "@/server/models/setting";
export default Vue.extend({
  name: "PageSystemSettings",
  layout: "admin",
  data() {
    return {
      form: this.$form.createForm(this),
      defaultSetting: defaultSetting,
      blogLogo: "",
      imgLoading: false,
      blogNameOpts: {
        rules: [
          {
            required: true,
            message: "博客名称不能为空！"
          }
        ]
      },
      postPageSizeOpts: {
        rules: [
          {
            required: true,
            message: "每页条数不能为空！"
          }
        ]
      },
      commentPageSizeOpts: {
        rules: [
          {
            required: true,
            message: "每页条数不能为空！"
          }
        ]
      }
    };
  },
  async mounted() {
    const { code, data }: IResp = await this.$axios.$get("/api/settings");
    if (code === 1) {
      const settings = data.settings;
      this.blogLogo = settings.blogLogo;
      this.setForm(settings);
    }
  },
  methods: {
    setForm(settings) {
      this.form.setFieldsValue({
        blogName: settings.blogName,
        blogSlogan: settings.blogSlogan,
        showBlogIntro: settings.showBlogIntro,
        blogIntro: settings.blogIntro,
        postPageSize: settings.postPageSize,
        enablePreview: settings.enablePreview,
        expandMenu: settings.expandMenu,
        showLicense: settings.showLicense,
        authName: settings.authName,
        commentPageSize: settings.commentPageSize,
        showTranslateBtn: settings.showTranslateBtn,
        translateKey: settings.translateKey,
        enableStatistics: settings.enableStatistics,
        statisticsKey: settings.statisticsKey
      });
    },
    beforeUpload(file) {
      const isImg = file.type.indexOf("image/") === 0;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImg) {
        this.$message.error("只允许上传图片！");
      } else if (!isLt2M) {
        this.$message.error("图片体积不能大于2M！");
      }
      return isImg && isLt2M;
    },

    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    },

    uploadChange(info) {
      if (info.file.status === "uploading") {
        this.imgLoading = true;
        return;
      }
      if (info.file.status === "done") {
        this.getBase64(info.file.originFileObj, imageUrl => {
          this.blogLogo = imageUrl;
          this.imgLoading = false;
        });
      }
    },
    save() {
      this.form.validateFieldsAndScroll((error, values) => {
        if (!error) {
          const data = values;
          data.blogLogo = this.blogLogo;
          this.$axios.$put("/admin/api/settings", data).then(resp => {
            if (resp.code === 1) {
              this.$message.success("保存成功！");
            } else {
              console.error(resp.message);
              this.$message.error("操作失败！");
            }
          });
        }
      });
    },
    reset() {
      this.blogLogo = defaultSetting.blogLogo;
      this.setForm(defaultSetting);
      (document.scrollingElement as HTMLElement).scrollTop = 0;
    }
  }
});
</script>

<style>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #777;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.img-tip {
  font-size: 12px;
  line-height: 1;
  margin: 2px 0 17px;
}

.img-tip i {
  position: relative;
  top: -1px;
}

.btn-wrap {
  margin-top: 30px;
}
</style>
