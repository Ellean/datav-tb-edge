<template>
  <div class="box">
    <div class="city">
      <div>{{ weatherCity }}</div>
      <div class="city-en">{{ weatherCityEN }}</div>
    </div>
    <div class="condition">
      <i :class="`qi-${weatherIcon}`"></i>
      <div class="condition-value">
        {{ weatherText }}
        <span class="condition-en">{{ weatherTextEN }}</span>
      </div>
    </div>
    <div class="temp">
      <div
        :style="{
          color:
            weatherTemp > 27
              ? '#DF5954'
              : weatherTemp < 15
              ? '#74D0DB'
              : '#FFFFFF',
        }"
      >
        <i
          :class="`qi-${
            weatherTemp > 27 ? '1009' : weatherTemp < 15 ? '1008' : ''
          }`"
        ></i>
        温度
        <span class="condition-en">Temp.</span>
      </div>
      <div
        class="temp-value"
        :style="{
          color:
            weatherTemp > 27
              ? '#DF5954'
              : weatherTemp < 15
              ? '#74D0DB'
              : '#FFFFFF',
        }"
      >
        {{ weatherTemp }} ℃
      </div>
    </div>
    <div class="humid">
      <div>
        <i class="qi-2120"></i>湿度 <span class="condition-en">Humid.</span>
      </div>
      <div class="humid-value">{{ weatherHumid }} %</div>
    </div>
  </div>
</template>

<script>
import { getWeatherZH, getWeatherEN } from "@/api/qweather";
import { mapState } from "vuex";

let weatherTimer = null;

export default {
  name: "WeatherInfo",
  data() {
    return {
      weatherCity: "嵊州",
      weatherCityEN: "ShengZhou",
      weatherIcon: "",
      weatherText: "",
      weatherTextEN: "",
      weatherTemp: "",
      weatherHumid: "",
    };
  },
  computed: mapState({
    color: "color",
    reversedColor: "reversedColor",
  }),
  mounted() {
    this.loadWeatherData();
    weatherTimer = setInterval(() => {
      this.loadWeatherData();
    }, 1000 * 60 * 10);
  },
  methods: {
    loadWeatherData() {
      getWeatherZH().then(({ data: { now } }) => {
        this.weatherIcon = now.icon;
        this.weatherText = now.text;
        this.weatherTemp = now.temp;
        this.weatherHumid = now.humidity;
      });
      getWeatherEN().then(({ data: { now } }) => {
        this.weatherTextEN = now.text;
      });
    },
  },
  beforeDestroy() {
    clearInterval(weatherTimer);
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;

  font-size: 1.2rem;
  font-weight: 900;

  .date {
    width: fit-content;
  }

  .city,
  .condition,
  .temp,
  .humid {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .condition {
    i {
      font-size: 2rem;
    }
  }

  [class$="-value"] {
    font-size: 1.2rem;
    font-weight: 900;
    color: #ffffff;
    text-align: center;
  }
}
</style>
