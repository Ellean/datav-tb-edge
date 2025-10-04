<template>
  <div class="main">
    <StateMap></StateMap>
    <WeatherInfo :currentDate="currentDate"></WeatherInfo>
    <div class="flex">
      <VisitorReview></VisitorReview>
      <BillBoard style="width: 47vw"></BillBoard>
      <CarbonFootprint></CarbonFootprint>
      <IndoorEnv></IndoorEnv>
      <VisitorStatistics></VisitorStatistics>
      <AdditionalInfo></AdditionalInfo>
    </div>
    <div
      style="
        padding: 12px 24px;
        box-shadow: 0px -4px 15px 15px #2b5dad inset;
        position: absolute;
        left: -24px;
        bottom: -8px;
        height: 3vh;
        width: 100vw;
      "
    ></div>
  </div>
</template>

<script>
import WeatherInfo from "./WeatherInfo.vue";
import IndoorEnv from "./IndoorEnv.vue";
import CarbonFootprint from "./CarbonFootprint.vue";
import VisitorReview from "./VisitorReview.vue";
import VisitorStatistics from "./VisitorStatistics.vue";
import StateMap from "./StateMap.vue";
import BillBoard from "./BillBoard.vue";
import AdditionalInfo from "./AdditionalInfo.vue";

export default {
  name: "MainBlock",
  components: {
    WeatherInfo,
    IndoorEnv,
    CarbonFootprint,
    VisitorReview,
    VisitorStatistics,
    StateMap,
    BillBoard,
    AdditionalInfo,
  },
  data() {
    return {
      currentDate: {},
    };
  },
  mounted() {
    setInterval(() => {
      const now = new Date();
      this.currentDate = {
        date: new Intl.DateTimeFormat("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(now),
        time: new Intl.DateTimeFormat("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(now),
      };
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: space-between;
  padding: 1vh 2vw 0 2vw;
  flex-wrap: wrap;
  gap: 1vh 2vw;
}
</style>
