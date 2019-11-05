<template>
  <div>
    <Form label-position="top" v-model="filters">
      <Row>
        <Col :xs="24" :sm="16">
          <FormItem label="标题">
            <Input placeholder="请输入标题" v-model="filters.title" clearable />
          </FormItem>
        </Col>
        <Col :xs="24" :sm="{ span: 7, offset: 1 }">
          <FormItem label="分类">
            <Select v-model="filters.cateId">
              <Option
                v-for="(item, index) in categories"
                :value="item._id"
                :key="index"
              >{{ item.cateName }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script lang="ts">
import { IResp } from "@/server/types";
export default {
  name: "PageAdminArticle",
  layout: "admin",
  data() {
    return {
      categories: [],
      filters: {
        title: "",
        cateId: "other"
      }
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    async getCategories() {
      const { code, data }: IResp = await this.$axios.$get(
        "/admin/api/categories"
      );
      if (code === 1) {
        this.categories = data;
      }
    }
  }
};
</script>

<style>
</style>