<template>
  <div class="container">
    <div class="title-columns">
      <div class="column">
        <div class="zh">维护人员</div>
        <div class="en">Maintenance Staff</div>
      </div>
    </div>
    <GlowBorder>
      <div class="content-columns">
        <div v-for="(staff, index) in staffList" :key="index" class="column">
          <div class="title">{{ staff.title || "-" }}</div>
          <div class="content">{{ staff.content || "-" }}</div>
        </div>
      </div>
    </GlowBorder>
  </div>
</template>

<script>
import GlowBorder from "./GlowBorder.vue";
import { mapGetters } from "vuex";
export default {
  name: "AdditionalInfo",
  components: {
    GlowBorder,
  },
  computed: {
    ...mapGetters(["staffList"]),
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.container {
  width: 45vw;

  .column {
    width: 33%;
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    font-weight: bold;
    font-size: 1.4rem;

    .zh,
    .en {
      align-self: center;
      font-size: 1.2rem;
      text-align: center;
      text-transform: uppercase;
    }

    .en {
      font-size: 0.7rem;
    }

    .title,
    .content {
      padding-left: 36px;
    }

    .title {
      background: url("@/assets/icons/contact.png") no-repeat left center / 32px;
    }

    .content {
      background: url("@/assets/icons/phone.png") no-repeat left center / 32px;
    }
  }
}
</style>
