<template>
  <div class="billboard">
    <img :src="image" alt="Billboard Image" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import defaultImage from "@/assets/images/ad.png";

export default {
  name: "BillBoard",
  computed: {
    ...mapGetters(["adImage"]),
    image: function () {
      return this.adImage || defaultImage;
    },
  },
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
