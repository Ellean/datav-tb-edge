<template>
  <div class="main">
    <div class="left">
      <div class="env">
        <dvBorderBox11
          :color="reversedColor"
          title="节能减排"
          :titleWidth="150"
        >
          <CarbonFootprint></CarbonFootprint>
        </dvBorderBox11>
      </div>
      <div class="carbon">
        <dvBorderBox11
          :color="reversedColor"
          title="环境监测"
          :titleWidth="150"
        >
          <IndoorEnv></IndoorEnv>
        </dvBorderBox11>
      </div>
    </div>
    <div class="center">
      <div class="status-map">
        <dvBorderBox8>
          <StateMap></StateMap>
        </dvBorderBox8>
      </div>
      <div class="info">
        <dvBorderBox11 :color="reversedColor" :title="currentDate">
          <WeatherInfo></WeatherInfo>
        </dvBorderBox11>
      </div>
      <div class="visitor">
        <div class="review">
          <dvBorderBox11
            :color="reversedColor"
            title="客流统计"
            :titleWidth="150"
          >
            <VisitorStatistics></VisitorStatistics>
          </dvBorderBox11>
        </div>
        <div class="statistics">
          <dvBorderBox11
            :color="reversedColor"
            title="满意度统计"
            :titleWidth="170"
          >
            <VisitorReview></VisitorReview>
          </dvBorderBox11>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="ads">
        <dvBorderBox3> </dvBorderBox3>
      </div>
    </div>
  </div>
</template>

<script>
import WeatherInfo from "./WeatherInfo.vue";
import IndoorEnv from "./IndoorEnv.vue";
import CarbonFootprint from "./CarbonFootprint.vue";
import VisitorReview from "./VisitorReview.vue";
import VisitorStatistics from "./VisitorStatistics.vue";
import StateMap from "./StateMap.vue";
import { mapState } from "vuex";

export default {
  name: "MainBlock",
  components: {
    WeatherInfo,
    IndoorEnv,
    CarbonFootprint,
    VisitorReview,
    VisitorStatistics,
    StateMap,
  },
  data() {
    return {
      currentDate: "",
    };
  },
  computed: mapState({
    color: "color",
    reversedColor: "reversedColor",
  }),
  mounted() {
    setInterval(() => {
      const now = new Date();
      this.currentDate = new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(now);
    }, 1000);
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 90vh;
  width: 100%;
  display: flex;
  gap: 24px;
  padding: 24px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;

  .left,
  .right,
  .center {
    width: 25%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 24px;

    .env,
    .carbon,
    .ads {
      height: fit-content;
      width: 100%;
    }
    .ads {
      aspect-ratio: 16 / 9;
      background: center / 120px url("@/assets/icons/ads-bg.png") no-repeat;
    }
  }

  .center {
    flex: 1;
    gap: 24px;

    .visitor {
      height: 17vh;
      display: flex;
      gap: 24px;

      .review,
      .statistics {
        height: 100%;
        flex: 1;
      }
    }

    .status-map,
    .info {
      width: 100%;
      height: 40vh;
      position: relative;
    }

    .status-map {
      width: 70vw;
    }

    .info {
      height: 16vh;
    }
  }
}
</style>
