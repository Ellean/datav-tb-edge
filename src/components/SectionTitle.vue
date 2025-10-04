<template>
  <div class="title">
    <div class="zh">{{ titleZh }}</div>
    <div class="en">{{ titleEn }}</div>
  </div>
</template>

<script>
export default {
  name: "SectionTitle",
  props: {
    titleZh: {
      type: String,
      default: "标题",
    },
    titleEn: {
      type: String,
      default: "Title",
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  width: 100%;
  margin-bottom: 16px;
  text-align: left;
  padding: 8px 60px;
  background: url("@/assets/images/bg_title.svg") left / cover no-repeat;

  .zh,
  .en {
    display: block;
    color: #fff;
    font-weight: 400;
    font-size: 2rem;
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
    padding-left: 24px;
    font-size: 0.9rem;
    font-weight: 400;
    text-transform: uppercase;
  }
}
</style>
