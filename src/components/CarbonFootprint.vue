<template>
  <div class="container">
    <SectionTitle
      titleZh="低碳节能"
      titleEn="Low Carbon & Energy Saving"
    ></SectionTitle>
    <GlowBorder>
      <div class="grid">
        <div class="water">
          <div class="water-zh">今日节水量</div>
          <div class="water-en">Water Saved (Today)</div>
        </div>
        <div class="water-monthly">
          <div class="water-monthly-zh">本月节水量</div>
          <div class="water-monthly-en">Water Saved (Month)</div>
        </div>
        <div class="carbon">
          <div class="carbon-zh">今日减碳量</div>
          <div class="carbon-en">Ammonia</div>
        </div>
        <div class="carbon-monthly">
          <div class="carbon-monthly-zh">本月减碳量</div>
          <div class="carbon-monthly-en">Hydrogen sulfide</div>
        </div>
        <div class="water-value">{{ waterDisplay }}</div>
        <div class="water-monthly-value">{{ waterMonthlyDisplay }}</div>
        <div class="carbon-value">{{ carbonDisplay }}</div>
        <div class="carbon-monthly-value">{{ carbonMonthlyDisplay }}</div>
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
  countTypeDay,
  countTypeMonth,
} from "@/utils/visitorStats";

export default {
  name: "CarbonFootprint",
  components: {
    SectionTitle,
    GlowBorder,
  },
  data() {
    return {
      // 原始数据，water单位g，carbon单位L
      rawWater: 0,
      rawWaterMonthly: 0,
      rawCarbon: 0,
      rawCarbonMonthly: 0,
    };
  },
  computed: {
    ...mapGetters(["visitorCount"]),
    todayToilet() {
      const { year, month, date } = getCurrentDateParts();
      return countTypeDay(this.visitorCount, year, month, date, "toilet");
    },
    todayUrinal() {
      const { year, month, date } = getCurrentDateParts();
      return countTypeDay(this.visitorCount, year, month, date, "urinal");
    },
    monthToilet() {
      const { year, month } = getCurrentDateParts();
      return countTypeMonth(this.visitorCount, year, month, "toilet");
    },
    monthUrinal() {
      const { year, month } = getCurrentDateParts();
      return countTypeMonth(this.visitorCount, year, month, "urinal");
    },
    carbonMonthly() {
      return (this.rawCarbonMonthly / 1000000).toFixed(4);
    },
    waterDisplay() {
      // 升->立方米
      if (this.rawWater >= 1000) {
        return (this.rawWater / 1000).toFixed(3) + " m³";
      } else if (this.rawWater > 0) {
        return this.rawWater.toFixed(0) + " L";
      } else {
        return "-";
      }
    },
    waterMonthlyDisplay() {
      if (this.rawWaterMonthly >= 1000) {
        return (this.rawWaterMonthly / 1000).toFixed(3) + " m³";
      } else if (this.rawWaterMonthly > 0) {
        return this.rawWaterMonthly.toFixed(0) + " L";
      } else {
        return "-";
      }
    },
    carbonDisplay() {
      // 克->千克
      if (this.rawCarbon >= 1000000) {
        return (this.rawCarbon / 1000000).toFixed(3) + " t";
      } else if (this.rawCarbon >= 1000) {
        return (this.rawCarbon / 1000).toFixed(2) + " kg";
      } else if (this.rawCarbon > 0) {
        return this.rawCarbon.toFixed(0) + " g";
      } else {
        return "-";
      }
    },
    carbonMonthlyDisplay() {
      if (this.rawCarbonMonthly >= 1000000) {
        return (this.rawCarbonMonthly / 1000000).toFixed(3) + " t";
      } else if (this.rawCarbonMonthly >= 1000) {
        return (this.rawCarbonMonthly / 1000).toFixed(2) + " kg";
      } else if (this.rawCarbonMonthly > 0) {
        return this.rawCarbonMonthly.toFixed(0) + " g";
      } else {
        return "-";
      }
    },
  },
  watch: {
    visitorCount: {
      handler() {
        // 计算节水量和减碳量
        const WATER_SAVED = { toilet: 6, urinal: 2 };
        const CARBON_SAVED = { toilet: 2.06, urinal: 0.69 };
        this.rawWater =
          this.todayToilet * WATER_SAVED.toilet +
          this.todayUrinal * WATER_SAVED.urinal;
        this.rawWaterMonthly =
          this.monthToilet * WATER_SAVED.toilet +
          this.monthUrinal * WATER_SAVED.urinal;
        this.rawCarbon =
          this.todayToilet * CARBON_SAVED.toilet +
          this.todayUrinal * CARBON_SAVED.urinal;
        this.rawCarbonMonthly =
          this.monthToilet * CARBON_SAVED.toilet +
          this.monthUrinal * CARBON_SAVED.urinal;
      },
      immediate: true,
      deep: true,
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
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 8px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "water water-value"
    "water-monthly water-monthly-value"
    "carbon carbon-value"
    "carbon-monthly carbon-monthly-value";

  align-items: center;

  .water,
  .carbon,
  .water-monthly,
  .carbon-monthly {
    padding-left: 12px;
    align-items: center;
    position: relative;

    &::before {
      content: "";
      display: inline-block;
      width: 16px;
      height: 16px;
      margin-right: 8px;
      border-radius: 50%;
      position: absolute;
      left: -24px;
      background-color: #3774d0;
    }
  }

  .water {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-area: water;

    .water-en {
      grid-area: 2 / 1 / 3 / 2;
    }

    .water-zh {
      grid-area: 1 / 1 / 2 / 2;
    }
  }

  .water-monthly {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-area: water-monthly;

    .water-monthly-zh {
      grid-area: 1 / 1 / 2 / 2;
    }

    .water-monthly-en {
      grid-area: 2 / 1 / 3 / 2;
    }

    &::before {
      background-color: #5fc1f1;
    }
  }

  .carbon {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-template-areas:
      "carbon-zh"
      "carbon-en";
    grid-area: carbon;

    .carbon-zh {
      grid-area: carbon-zh;
    }

    .carbon-en {
      grid-area: carbon-en;
    }

    &::before {
      background-color: #71eee6;
    }
  }

  .carbon-monthly {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-auto-flow: row;
    grid-template-areas:
      "carbon-monthly-zh"
      "carbon-monthly-en";
    grid-area: carbon-monthly;

    .carbon-monthly-zh {
      grid-area: carbon-monthly-zh;
    }

    .carbon-monthly-en {
      grid-area: carbon-monthly-en;
    }

    &::before {
      background-color: #d99f3b;
    }
  }

  .water-value {
    grid-area: water-value;
  }

  .water-monthly-value {
    grid-area: water-monthly-value;
  }

  .carbon-value {
    grid-area: carbon-value;
  }

  .carbon-monthly-value {
    grid-area: carbon-monthly-value;
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
