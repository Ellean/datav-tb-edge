<template>
  <div class="billboard">
    <img src="@/assets/images/ad.png" alt="Billboard Image" />
  </div>
</template>

<script>
export default {
  name: "BillBoard",
};
</script>

<style scoped lang="scss">
.billboard {
  width: 100%;
  height: 100%;
  border: 1px solid #4ba8f4;
  display: inline-block;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
