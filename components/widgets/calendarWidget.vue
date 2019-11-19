<template>
  <div class="widget-container">
    <div class="widget-header">博客日历</div>
    <a-calendar
      :fullscreen="false"
      :disabledDate="disabledDate"
      @panelChange="panelChange"
      @select="selectDate"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment, { Moment } from "moment";
export default Vue.extend({
  data() {
    return {
      dateMode: "month" as "month" | "year"
    };
  },
  methods: {
    disabledDate(date) {
      return date && date > moment().endOf("month");
    },
    panelChange(date, mode: "month" | "year") {
      this.dateMode = mode;
    },
    selectDate(date: Moment) {
      let inputDateMoment: [Moment, Moment];
      if (this.dateMode === "year") {
        const start = moment(date.startOf("month"));
        const end = moment(date.endOf("month"));
        inputDateMoment = [start, end];
      } else {
        inputDateMoment = [date, date];
      }
      window.scrollTo(0, 0);
      this.$emit("selectCalendar", inputDateMoment);
    }
  }
});
</script>

<style>
.widget-container .ant-fullcalendar {
  border-color: #e7eaec;
}
</style>