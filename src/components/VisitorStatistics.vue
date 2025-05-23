<template>
  <div class="container">
    <div class="daily"></div>
    <div class="monthly"></div>
    <div class="sum"></div>
    <div class="daily-value">{{ daily }} 人次</div>
    <div class="monthly-value">{{ monthly }} 人次</div>
    <div class="sum-value">{{ sum }} 人次</div>
  </div>
</template>

<script>
export default {
  name: "VisitorStatistics",
  data() {
    return {
      daily: 10,
      monthly: 800,
      sum: 8933,
    };
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "daily monthly sum"
    "daily monthly sum"
    "daily-value monthly-value sum-value";
}

.daily {
  grid-area: daily;
  background: center / 40px url("@/assets/icons/statistics-daily.png") no-repeat;
}

.monthly {
  grid-area: monthly;
  background: center / 40px url("@/assets/icons/statistics-monthly.png")
    no-repeat;
}

.sum {
  grid-area: sum;
  background: center / 40px url("@/assets/icons/statistics-sum.png") no-repeat;
}

.daily-value {
  grid-area: daily-value;
}

.monthly-value {
  grid-area: monthly-value;
}

.sum-value {
  grid-area: sum-value;
}

[class$="-value"] {
  font-size: 1.2rem;
  font-weight: 900;
  color: #4fd2dd;
  text-align: center;
}
</style>
