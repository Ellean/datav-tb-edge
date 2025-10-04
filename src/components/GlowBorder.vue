<template>
  <div>
    <div class="border start"></div>
    <slot></slot>
    <div class="border end"></div>
  </div>
</template>

<script>
export default {
  name: "GlowBorder",
};
</script>

<style scoped lang="scss">
.border {
  height: 2px;
  border: none;
  background: linear-gradient(to right, #0e3386 0%, #4fc3f7 50%, #0e3386 100%);

  &.start {
    margin-top: 1vh;
    margin-bottom: 0.8vh;
  }

  &.end {
    margin-top: 0.8vh;
    margin-bottom: 0.5vh;
  }
}
</style>
