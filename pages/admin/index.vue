<template>
  <div class="admin-index">
    <div class="page-header">数据统计</div>
    <div class="stats-body">
      <a-row>
        <a-col :md="24" :lg="8">
          <div class="stats-panel">
            <a-row>
              <a-col :xs="24" :sm="12">
                <div class="left-stats">
                  <h3>创作中文章</h3>
                  <div class="primary-div">
                    <nuxt-link to="/">{{ postsStats.draft }}</nuxt-link>
                    <span>篇</span>
                  </div>
                  <div class="btn-new">
                    <nuxt-link class="ant-btn ant-btn-dashed" to="/admin/article-edit">
                      <font-awesome-icon :icon="['fas', 'plus']" style="margin-right: 4px;"></font-awesome-icon>新的文章
                    </nuxt-link>
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12">
                <div class="right-stats">
                  <div>
                    7天内发布
                    <nuxt-link to="/">{{ postsStats.oneweek }}</nuxt-link>
                    <span>篇</span>
                  </div>
                  <div>
                    30天内发布
                    <nuxt-link to="/">{{ postsStats.onemonth }}</nuxt-link>
                    <span>篇</span>
                  </div>
                  <div>
                    总计发布
                    <nuxt-link to="/">{{ postsStats.totalPosts }}</nuxt-link>
                    <span>篇</span>
                  </div>
                  <div>
                    全部分类
                    <nuxt-link to="/">{{ postsStats.totalCategories }}</nuxt-link>
                    <span>个</span>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :md="24" :lg="8">
          <div class="stats-panel">
            <a-row>
              <a-col :xs="24" :sm="12">
                <div class="left-stats">
                  <h3>今日评论</h3>
                  <div class="primary-div">
                    <a @click="clickStats(1)">{{ commentsStats.today }}</a>
                    <span>条</span>
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12">
                <div class="right-stats">
                  <div>
                    昨日评论
                    <nuxt-link to="/">{{ commentsStats.yesterday }}</nuxt-link>
                    <span>条</span>
                  </div>
                  <div>
                    7天内评论
                    <nuxt-link to="/">{{ commentsStats.oneweek }}</nuxt-link>
                    <span>条</span>
                  </div>
                  <div>
                    30天内评论
                    <nuxt-link to="/">{{ commentsStats.onemonth }}</nuxt-link>
                    <span>条</span>
                  </div>
                  <div>
                    全部评论
                    <nuxt-link to="/">{{ commentsStats.total }}</nuxt-link>
                    <span>条</span>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
        <a-col :md="24" :lg="8">
          <div class="stats-panel">
            <a-row>
              <a-col :xs="24" :sm="12">
                <div class="left-stats">
                  <h3>今日留言</h3>
                  <div class="primary-div">
                    <nuxt-link to="/">{{ guestbookStats.today }}</nuxt-link>
                    <span>条</span>
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12">
                <div class="right-stats">
                  <div>
                    昨日留言
                    <nuxt-link to="/">{{ guestbookStats.yesterday }}</nuxt-link>
                    <span>条</span>
                  </div>
                  <div>
                    7天内留言
                    <nuxt-link to="/">{{ guestbookStats.oneweek }}</nuxt-link>
                    <span>条</span>
                  </div>
                  <div>
                    30天内留言
                    <nuxt-link to="/">{{ guestbookStats.onemonth }}</nuxt-link>
                    <span>条</span>
                  </div>
                  <div>
                    全部留言
                    <nuxt-link to="/">{{ guestbookStats.total }}</nuxt-link>
                    <span>条</span>
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="24" :lg="12" :xl="8">
          <div class="stats-panel">
            <ve-pie :data="categoryChartData" :settings="categoryChartSettings" ref="chart1"></ve-pie>
            <div class="stats-name">文章分类数据统计</div>
          </div>
        </a-col>
        <a-col :md="24" :lg="12" :xl="16">
          <div class="stats-panel">
            <ve-bar :data="commentsAndGuestbookChartData" :extend="extend" ref="chart2"></ve-bar>
            <div class="stats-name">近一周评论与留言数量</div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VePie from "v-charts/lib/pie";
import VeBar from "v-charts/lib/histogram";
export default Vue.extend({
  name: "PageAdminIndex",
  layout: "admin",
  components: {
    VePie,
    VeBar
  },
  data() {
    return {
      commentsStats: {
        today: 0,
        yesterday: 0,
        oneweek: 0,
        onemonth: 0,
        total: 0
      },
      guestbookStats: {
        today: 0,
        yesterday: 0,
        oneweek: 0,
        onemonth: 0,
        total: 0
      },
      postsStats: {
        draft: 0,
        oneweek: 0,
        onemonth: 0,
        totalPosts: 0,
        totalCategories: 0
      },
      categoriesStats: [],
      commentsAndGuestbookStats: {
        commentsStats: {},
        guestbookStats: {}
      },
      categoryChartSettings: {
        limitShowNum: 2
      },
      extend: {
        series: {
          label: { show: true, position: "top" }
        }
      }
    };
  },
  computed: {
    categoryChartData() {
      const columns = ["分类", "文章数"];
      const rows: any[] = [];
      this.categoriesStats.forEach((item: any) => {
        rows.push({
          分类: item.cateName,
          文章数: item.postsCount
        });
      });
      return {
        columns,
        rows
      };
    },
    commentsAndGuestbookChartData() {
      const columns = ["日期", "评论数", "留言数"];
      const rows: any[] = [];
      const commentsStats = this.commentsAndGuestbookStats.commentsStats;
      Object.keys(commentsStats).forEach(date => {
        rows.push({
          日期: date,
          评论数: commentsStats[date]
        });
      });
      const guestbookStats = this.commentsAndGuestbookStats.guestbookStats;
      Object.keys(guestbookStats).forEach((date, index) => {
        rows[index]["留言数"] = guestbookStats[date];
      });
      return {
        columns,
        rows
      };
    }
  },
  async created() {
    const stats = await Promise.all([
      this.$axios.$get("/admin/api/commentsStats"),
      this.$axios.$get("/admin/api/guestbookStats"),
      this.$axios.$get("/admin/api/postsStats"),
      this.$axios.$get("/admin/api/categoriesStats"),
      this.$axios.$get("/admin/api/commentsAndGuestbookStats")
    ]);
    if (stats[0].code === 1) {
      this.commentsStats = stats[0].data;
    }
    if (stats[1].code === 1) {
      this.guestbookStats = stats[1].data;
    }
    if (stats[2].code === 1) {
      this.postsStats = stats[2].data;
    }
    if (stats[3].code === 1) {
      this.categoriesStats = stats[3].data;
    }
    if (stats[4].code === 1) {
      this.commentsAndGuestbookStats = stats[4].data;
    }
  },
  mounted() {
    (this as any).$bus.$on("changeLayout", () => {
      this.$nextTick(() => {
        (this.$refs.chart1 as any).echarts.resize();
        (this.$refs.chart2 as any).echarts.resize();
      });
    });
  },
  methods: {
    clickStats(type) {
      switch (type) {
        case 1:
          this.$router.push('/admin/comment-manage?createTime=20191125&createTime=20191126');
      }
    }
  }
});
</script>

<style>
.stats-body {
  padding: 25px;
  min-height: 80vh;
}

.stats-panel {
  background: #fff;
  border-radius: 5px;
  margin: 15px;
  padding: 20px;
  color: #777;
  padding: 20px 20px 5px;
}

.left-stats,
.right-stats {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 15px;
}

.left-stats h3 {
  margin: 0;
  font-weight: 500;
  color: #444;
}

.right-stats div {
  line-height: 1;
}

.right-stats a {
  font-weight: 500;
}

.primary-div {
  color: #555;
  display: flex;
  align-items: flex-end;
}

.primary-div a {
  font-size: 36px;
  line-height: 30px;
  margin-right: 8px;
}

.primary-div span {
  line-height: 1;
}

.stats-name {
  text-align: center;
  margin-bottom: 20px;
}
</style>
