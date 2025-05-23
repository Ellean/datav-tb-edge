<template>
  <div class="grid">
    <div class="temp"></div>
    <div class="temp-zh">温度</div>
    <div class="temp-en">Temperature</div>
    <div class="temp-value">{{ temp }} ℃</div>
    <div class="humid"></div>
    <div class="humid-zh">湿度</div>
    <div class="humid-en">Humidity</div>
    <div class="humid-value">{{ humid }} %</div>
    <div class="NH3">NH₃</div>
    <div class="NH3-zh">氨气</div>
    <div class="NH3-en">Ammonia</div>
    <div class="NH3-value">{{ NH3 }} ppm</div>
    <div class="H2S">H₂S</div>
    <div class="H2S-zh">硫化氢</div>
    <div class="H2S-en">Hydrogen sulfide</div>
    <div class="H2S-value">{{ H2S }} ppm</div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "IndoorEnv",
  data() {
    return {
      temp: "23.4",
      humid: "88",
      NH3: "0.001",
      H2S: "0.01",
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
    "temp temp-zh temp-value"
    "temp temp-en temp-value"
    "humid humid-zh humid-value"
    "humid humid-en humid-value"
    "NH3 NH3-zh NH3-value"
    "NH3 NH3-en NH3-value"
    "H2S H2S-zh H2S-value"
    "H2S H2S-en H2S-value";
  line-height: 30px;

  .temp {
    grid-area: temp;
    background: center / 40px url("@/assets/icons/temp.png") no-repeat;
  }
  .humid {
    grid-area: humid;
    background: center / 40px url("@/assets/icons/humid.png") no-repeat;
  }
  .NH3,
  .H2S {
    grid-area: NH3;
    color: #4fd2dd;
    font-size: 1.3rem;
    font-weight: 900;
    text-align: center;
    line-height: 62px;
  }
  [class$="-value"] {
    font-size: 1.2rem;
    font-weight: 900;
    color: #4fd2dd;
    line-height: 62px;
    text-align: end;
  }
  .H2S {
    grid-area: H2S;
  }
  .humid-value {
    grid-area: humid-value;
  }
  .NH3-value {
    grid-area: NH3-value;
  }
  .H2S-value {
    grid-area: H2S-value;
  }
  .temp-value {
    grid-area: temp-value;
  }
  .temp-zh {
    grid-area: temp-zh;
  }
  .temp-en {
    grid-area: temp-en;
  }
  .humid-zh {
    grid-area: humid-zh;
  }
  .humid-en {
    grid-area: humid-en;
  }
  .NH3-zh {
    grid-area: NH3-zh;
  }
  .NH3-en {
    grid-area: NH3-en;
  }
  .H2S-zh {
    grid-area: H2S-zh;
  }
  .H2S-en {
    grid-area: H2S-en;
  }
}
</style>
