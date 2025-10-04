<template>
  <div class="box">
    <div class="date">
      <div class="time">{{ currentDate.time }}</div>
      <div class="date">{{ currentDate.date }}</div>
    </div>
    <div v-if="location" class="condition">
      <i :class="`qi-${weatherIcon}`"></i>
      <div class="condition-value">
        {{ weatherText }}
        <span class="condition-en">{{ weatherTextEN }}</span>
      </div>
    </div>
    <div v-if="location" class="temp">
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
    <div v-if="location" class="humid">
      <div>
        <i class="qi-2120"></i>湿度 <span class="condition-en">Humid.</span>
      </div>
      <div class="humid-value">{{ weatherHumid }} %</div>
    </div>
    <div v-else>
      <div class="condition-value">未设置城市 / 坐标</div>
    </div>
  </div>
</template>

<script>
import {
  getWeatherZH,
  getWeatherEN,
  getCityInfoZH,
  getCityInfoEN,
} from "@/api/qweather";
import { mapGetters } from "vuex";

let weatherTimer = null;

export default {
  name: "WeatherInfo",
  props: {
    currentDate: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      weatherCity: "",
      weatherCityEN: "",
      weatherIcon: "",
      weatherText: "",
      weatherTextEN: "",
      weatherTemp: "",
      weatherHumid: "",
    };
  },
  computed: {
    ...mapGetters(["location"]),
  },
  watch: {
    location(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadWeatherData();
      }
    },
  },
  mounted() {
    this.loadWeatherData();
    weatherTimer = setInterval(() => {
      this.loadWeatherData();
    }, 1000 * 60 * 10);
  },
  methods: {
    loadWeatherData() {
      if (this.location) {
        getWeatherZH(this.location)
          .then(({ data: { now } }) => {
            this.weatherIcon = now.icon;
            this.weatherText = now.text;
            this.weatherTemp = now.temp;
            this.weatherHumid = now.humidity;
          })
          .catch((err) => {
            console.error("获取天气信息失败", err);
          });
        getWeatherEN(this.location)
          .then(({ data: { now } }) => {
            this.weatherTextEN = now.text;
          })
          .catch((err) => {
            console.error("获取天气信息失败", err);
          });
        getCityInfoZH(this.location)
          .then(({ data }) => {
            this.weatherCity = data.location[0].name;
          })
          .catch((err) => {
            console.error("获取城市信息失败", err);
          });
        getCityInfoEN(this.location)
          .then(({ data }) => {
            this.weatherCityEN = data.location[0].name;
          })
          .catch((err) => {
            console.error("获取城市信息失败", err);
          });
      }
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
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 9vh;
  padding: 12px;
  box-shadow: 0px 0px 15px 4px #265fbc inset;
  position: relative;
  left: -12px;

  font-size: 1.2rem;
  font-weight: 900;

  .date {
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;

    .time {
      font-size: 1.5rem;
      font-weight: 900;
      color: #ffffff;
      text-align: center;
    }

    .date {
      font-size: 0.5rem;
      font-weight: 900;
      color: #999999;
      text-align: center;
    }
  }

  .condition,
  .temp,
  .humid {
    display: flex;
    align-items: center;
    gap: 16px;
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
