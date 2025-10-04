<template>
  <div class="header-bar">
    <div class="header">
      <div class="zh">乘云智慧驿站引导系统</div>
      <div class="en">Cheng Yun Smart Station Guidance System</div>
      <div class="message">{{ messageContent }}</div>
    </div>
    <div class="sub-header">
      <div class="icon"></div>
      <div class="site-info">
        <div class="zh">{{ siteName }}</div>
        <div class="en">{{ siteNameEn }}</div>
      </div>
      <div class="legend"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "HeaderBlock",
  data() {
    return {
      messageContent: "",
    };
  },
  watch: {
    message(nV) {
      this.messageContent = nV;
      setTimeout(() => {
        this.messageContent = "";
      }, 60000);
    },
  },
  computed: {
    ...mapState({
      message: "message",
    }),
    ...mapGetters(["siteName", "siteNameEn"]),
  },
};
</script>

<style lang="scss" scoped>
.zh {
  display: inline-block;
  color: #fff;
  font-weight: 800;
  font-size: 1.7rem;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  position: relative;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(0, 0, 0, 0.25),
    0 -1px 0 rgba(191, 231, 255, 0.35), 0 3px 8px rgba(3, 37, 63, 0.45);
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 40%,
    rgba(255, 255, 255, 0.1) 100%
  );
  mask-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 1) 40%,
    rgba(255, 255, 255, 0.1) 100%
  );
  /* 兼容性优化 */
  -webkit-background-clip: text;
  background-clip: text;
}

.en {
  margin-top: 0.5vh;
  font-size: 0.7rem;
  font-weight: 100;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
}

.header {
  padding: 12px 12px 24px 12px;
  box-shadow: 0px -4px 15px 4px #2b5dad inset;
  position: relative;
  left: -12px;

  height: 3vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  background-image: url("@/assets/images/bg_header.png");
  background-position: 0px 12px;
  background-size: contain;
  background-repeat: no-repeat;
}

.sub-header {
  width: 100vw;
  display: flex;
  align-items: center;
  padding: 12px 48px 12px 12px;
  box-sizing: border-box;
  gap: 12px;

  .icon {
    width: 80px;
    aspect-ratio: 1 / 1;
    background: url("@/assets/icons/site.png") center / contain no-repeat;
  }

  .site-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .zh {
      font-size: 2rem;
      font-weight: normal;
    }

    .en {
      margin: 8px 0 0 4px;
      font-size: 0.8rem;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
    }
  }

  .legend {
    margin-left: auto;
    width: 154px;
    height: 48px;
    background: url("@/assets/images/legend_vacant.png") left / contain
        no-repeat,
      url("@/assets/images/legend_occupied.png") right / contain no-repeat;
  }
}
</style>
