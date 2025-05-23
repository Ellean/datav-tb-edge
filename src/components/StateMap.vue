<template>
  <div class="container">
    <div
      class="block"
      v-for="{ key, x, y, w, h, type, occupied } in mapConfig"
      :key="key"
      :class="[type, { occupied: occupied }]"
      :style="{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
      }"
    >
      <dvBorderBox7 :color="occupied ? [] : color"></dvBorderBox7>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "StateMap",
  data() {
    return {
      mapConfig: [
        {
          key: "accessibility",
          x: 0,
          y: 0,
          w: 30,
          h: 40,
          type: "accessibility",
          occupied: false,
        },
        {
          key: "baby",
          x: 0,
          y: 40,
          w: 30,
          h: 40,
          type: "baby",
          occupied: false,
        },
        {
          key: "vending",
          x: 0,
          y: 80,
          w: 10,
          h: 20,
          type: "vending",
          occupied: false,
        },
        {
          key: "vending",
          x: 10,
          y: 80,
          w: 20,
          h: 20,
          type: "vending",
          occupied: false,
        },
        {
          key: "toilet-1",
          x: 30,
          y: 0,
          w: 20,
          h: 50,
          type: "toilet",
          occupied: false,
        },
        {
          key: "toilet-2",
          x: 30,
          y: 50,
          w: 20,
          h: 50,
          type: "toilet",
          occupied: false,
        },
        {
          key: "toilet-3",
          x: 80,
          y: 0,
          w: 20,
          h: 50,
          type: "toilet",
          occupied: false,
        },
        {
          key: "toile-4",
          x: 80,
          y: 50,
          w: 20,
          h: 50,
          type: "toilet",
          occupied: false,
        },
        {
          key: "sink",
          x: 50,
          y: 0,
          w: 30,
          h: 20,
          type: "sink",
          occupied: false,
        },
      ],
    };
  },
  computed: mapState({
    color: "color",
  }),
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  .block {
    position: absolute;

    &.accessibility {
      background: center / 60px
        url("@/assets/icons/accessibility-available.png") no-repeat;
      &.occupied {
        background: center / 60px
          url("@/assets/icons/accessibility-occupied.png") no-repeat;
      }
    }

    &.baby {
      background: center / 60px url("@/assets/icons/baby-available.png")
        no-repeat;
      &.occupied {
        background: center / 60px url("@/assets/icons/baby-occupied.png")
          no-repeat;
      }
    }

    &.vending {
      background: center / 60px url("@/assets/icons/vending-available.png")
        no-repeat;
      &.occupied {
        background: center / 60px url("@/assets/icons/vending-occupied.png")
          no-repeat;
      }
    }

    &.toilet {
      background: center / 60px url("@/assets/icons/toilet-available.png")
        no-repeat;
      &.occupied {
        background: center / 60px url("@/assets/icons/toilet-occupied.png")
          no-repeat;
      }
    }

    &.sink {
      background: center / 60px url("@/assets/icons/sink-available.png")
        no-repeat;
      &.occupied {
        background: center / 60px url("@/assets/icons/sink-occupied.png")
          no-repeat;
      }
    }
  }
}
</style>
