<template>
  <div class="grid">
    <div class="water"></div>
    <div class="water-zh">本日节水量</div>
    <div class="water-en">Water Saved (Today)}</div>
    <div class="water-value">{{ water }} m³</div>
    <div class="water-monthly"></div>
    <div class="water-monthly-zh">本月节水量</div>
    <div class="water-monthly-en">Water Saved (Month)</div>
    <div class="water-monthly-value">{{ waterMonthly }} m³</div>
    <div class="carbon"></div>
    <div class="carbon-zh">本日减碳量</div>
    <div class="carbon-en">Ammonia</div>
    <div class="carbon-value">{{ carbon }} KG</div>
    <div class="carbon-monthly"></div>
    <div class="carbon-monthly-zh">本月减碳量</div>
    <div class="carbon-monthly-en">Hydrogen sulfide</div>
    <div class="carbon-monthly-value">{{ carbonMonthly }} T</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CarbonFootprint",
  data() {
    return {
      water: "23.4",
      waterMonthly: "88",
      carbon: "1468",
      carbonMonthly: "28.76",
    };
  },
  computed: mapState({
    color: "color",
    reversedColor: "reversedColor",
  }),
};
</script>

<style lang="scss" scoped>
.grid {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 50px 1fr 1fr;
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
