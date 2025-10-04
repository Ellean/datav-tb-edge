<template>
  <div class="container">
    <SectionTitle titleZh="客流统计" titleEn="Visitor Statistics" />
    <GlowBorder>
      <div class="grid">
        <div class="daily">
          <div class="daily-zh">今日</div>
          <div class="daily-en">Today</div>
        </div>
        <div class="monthly">
          <div class="monthly-zh">本月</div>
          <div class="monthly-en">This Month</div>
        </div>
        <div class="sum">
          <div class="sum-zh">累计</div>
          <div class="sum-en">Total</div>
        </div>
        <div class="daily-value">{{ daily || "-" }} 人次</div>
        <div class="monthly-value">{{ monthly || "-" }} 人次</div>
        <div class="sum-value">{{ sum || "-" }} 人次</div>
      </div>
    </GlowBorder>
  </div>
</template>

<script>
import SectionTitle from "./SectionTitle.vue";
import GlowBorder from "./GlowBorder.vue";
import { mapGetters } from "vuex";
import {
  getCurrentDateParts,
  countDay,
  countMonth,
  countTotal,
} from "@/utils/visitorStats";

export default {
  name: "VisitorStatistics",
  components: {
    SectionTitle,
    GlowBorder,
  },
  computed: {
    ...mapGetters(["visitorCount"]),
    daily() {
      const { year, month, date } = getCurrentDateParts();
      return countDay(this.visitorCount, year, month, date);
    },
    monthly() {
      const { year, month } = getCurrentDateParts();
      return countMonth(this.visitorCount, year, month);
    },
    sum() {
      return countTotal(this.visitorCount);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 45vw;
}

.grid {
  padding: 0 2vw;
  display: grid;
  grid-template-columns: 1.5fr 0.5fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 12px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "daily daily-value"
    "monthly monthly-value"
    "sum sum-value";

  .daily-value {
    grid-area: daily-value;
  }
  .monthly-value {
    grid-area: monthly-value;
  }
  .sum-value {
    grid-area: sum-value;
  }

  .daily,
  .monthly,
  .sum {
    padding-left: 12px;
    align-items: center;
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    &::before {
      content: "";
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 8px;
      border-radius: 50%;
      position: absolute;
      left: -24px;
      background-size: cover;
    }
  }

  .daily {
    grid-area: daily;
    grid-template-areas:
      "daily-zh"
      "daily-en";
    .daily-zh {
      grid-area: daily-zh;
    }
    .daily-en {
      grid-area: daily-en;
    }
    &::before {
      background-color: #3774d0;
    }
  }

  .monthly {
    grid-area: monthly;
    grid-template-areas:
      "monthly-zh"
      "monthly-en";
    .monthly-zh {
      grid-area: monthly-zh;
    }
    .monthly-en {
      grid-area: monthly-en;
    }
    &::before {
      background-color: #5fc1f1;
    }
  }

  .sum {
    grid-area: sum;
    grid-template-areas:
      "sum-zh"
      "sum-en";
    .sum-zh {
      grid-area: sum-zh;
    }
    .sum-en {
      grid-area: sum-en;
    }
    &::before {
      background-color: #71eee6;
    }
  }

  [class$="-value"] {
    font-size: 1.2rem;
    color: #4fd2dd;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
