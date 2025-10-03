<template>
  <div class="grid">
    <div class="water"></div>
    <div class="water-zh">本日节水量</div>
    <div class="water-en">Water Saved (Today)</div>
    <div class="water-value">{{ waterDisplay }}</div>
    <div class="water-monthly"></div>
    <div class="water-monthly-zh">本月节水量</div>
    <div class="water-monthly-en">Water Saved (Month)</div>
    <div class="water-monthly-value">{{ waterMonthlyDisplay }}</div>
    <div class="carbon"></div>
    <div class="carbon-zh">本日减碳量</div>
    <div class="carbon-en">Ammonia</div>
    <div class="carbon-value">{{ carbonDisplay }}</div>
    <div class="carbon-monthly"></div>
    <div class="carbon-monthly-zh">本月减碳量</div>
    <div class="carbon-monthly-en">Hydrogen sulfide</div>
    <div class="carbon-monthly-value">{{ carbonMonthlyDisplay }}</div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import {
  getCurrentDateParts,
  countTypeDay,
  countTypeMonth,
} from "@/utils/visitorStats";

export default {
  name: "CarbonFootprint",
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
    ...mapState({
      color: "color",
      reversedColor: "reversedColor",
    }),
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
.grid {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 50px 1.5fr 1fr;
  grid-template-rows: 30px 30px 30px 30px 30px 30px 30px 30px;
  gap: 12px 12px;
  grid-template-areas:
    "water water-zh water-value"
    "water water-en water-value"
    "water-monthly water-monthly-zh water-monthly-value"
    "water-monthly water-monthly-en water-monthly-value"
    "carbon carbon-zh carbon-value"
    "carbon carbon-en carbon-value"
    "carbon-monthly carbon-monthly-zh carbon-monthly-value"
    "carbon-monthly carbon-monthly-en carbon-monthly-value";
  line-height: 30px;

  .water {
    grid-area: water;
    background: center / 40px url("@/assets/icons/water.png") no-repeat;
  }
  .water-monthly {
    grid-area: water-monthly;
    background: center / 40px url("@/assets/icons/water.png") no-repeat;
  }
  .carbon,
  .carbon-monthly {
    grid-area: carbon;
    color: #4fd2dd;
    font-size: 1.3rem;
    font-weight: 900;
    text-align: center;
    line-height: 62px;
    background: center / 40px url("@/assets/icons/carbon.png") no-repeat;
  }
  [class$="-value"] {
    font-size: 1.2rem;
    font-weight: 900;
    color: #4fd2dd;
    line-height: 62px;
    text-align: end;
  }
  .carbon-monthly {
    grid-area: carbon-monthly;
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
  .water-value {
    grid-area: water-value;
  }
  .water-zh {
    grid-area: water-zh;
  }
  .water-en {
    grid-area: water-en;
  }
  .water-monthly-zh {
    grid-area: water-monthly-zh;
  }
  .water-monthly-en {
    grid-area: water-monthly-en;
  }
  .carbon-zh {
    grid-area: carbon-zh;
  }
  .carbon-en {
    grid-area: carbon-en;
  }
  .carbon-monthly-zh {
    grid-area: carbon-monthly-zh;
  }
  .carbon-monthly-en {
    grid-area: carbon-monthly-en;
  }
}
</style>
