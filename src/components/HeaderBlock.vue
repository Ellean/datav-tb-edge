<template>
  <div class="header">
    <div class="SN">
      <dvBorderBox5 :color="reversedColor">
        <div class="text">设备编号</div>
        <div class="en">SN</div>
        <div class="value">{{ serialNumber }}</div></dvBorderBox5
      >
    </div>
    <div class="title">
      <div class="text">{{ siteName }}</div>
    </div>
    <div class="active-date">
      <dvBorderBox5 :color="reversedColor" reverse>
        <div class="text">激活日期</div>
        <div class="en">AT</div>
        <div class="value">{{ activationDate }}</div>
      </dvBorderBox5>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "HeaderBlock",
  data() {
    return {
      serialNumber: "CYZH-001",
      activationDate: "2025-05-01",
      siteName: "乘云智慧驿站-展厅 Smart Station - Exhibition Hall",
    };
  },
  computed: mapState({
    color: "color",
    reversedColor: "reversedColor",
  }),
};
</script>

<style lang="scss" scoped>
.header {
  height: 8vh;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  position: relative;

  .SN,
  .active-date {
    color: #235fa7ff;
    width: 15vw;
    height: 100%;
    font-size: 1rem;

    .text {
      width: fit-content;
      transform: translate(9.5vw, 2vh) rotate(-45deg);
      transform-origin: right top;
    }

    .en {
      width: fit-content;
      transform: translate(1vw, 1vh) rotate(-45deg);
    }

    .value {
      width: 100%;
      line-height: 8vh;
      text-align: center;
      position: absolute;
      top: 0;
    }
  }

  .active-date {
    .text {
      transform: translate(0vw, 1vh) rotate(-45deg);
    }

    .en {
      transform: translate(13vw, 1vh) rotate(-45deg);
    }
  }

  .title {
    flex: 1;
    height: 100%;
    padding: 0 4vw;

    .text {
      font-size: 2.5rem;
      line-height: 8vh;
      text-align: center;
      background: linear-gradient(to right, #4fd2dd, #4fd2dd);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
