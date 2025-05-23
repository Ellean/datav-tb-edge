<template>
  <dvFullScreenContainer>
    <HeaderBar></HeaderBar>
    <MainBlock></MainBlock>
  </dvFullScreenContainer>
</template>

<script>
import HeaderBar from "./components/HeaderBlock.vue";
import MainBlock from "./components/MainBlock.vue";

export default {
  name: "App",
  components: { HeaderBar, MainBlock },
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style lang="scss">
@import "@/assets/qweather-icons.css";

body {
  margin: 0;
  padding: 0;
  color: white;
  font-family: "Source Han Sans CN", sans-serif;
  background-color: #001763;
}

.dv-border-box-11 {
  box-sizing: border-box;
  padding: calc(5vh + 12px) 24px 24px 24px;
}

[class$="-en"] {
  font-size: 0.9rem;
  font-weight: 100;
  opacity: 0.5;
}

[class$="-zh"] {
  font-size: 1.2rem;
}
</style>
