<template>
  <div
    class="container"
    ref="container"
    :style="{
      width,
      height,
    }"
  >
    <vue-draggable-resizable
      v-for="(block, index) in mapConfig"
      :key="block.key"
      :x="block.x"
      :y="block.y"
      :w="block.w"
      :h="block.h"
      parent
      @dragging="onDragging(index, ...arguments)"
      @dragstop="onDragstop(index, ...arguments)"
      @resizing="onResizing(index, ...arguments)"
      @resizestop="onResizestop(index, ...arguments)"
    >
      <!-- parent -->
      <div
        class="block"
        :style="{
          boxShadow: block.type
            ? `0px 0px 20px 13px  ${
                STATE_MAP[getBlockState(block, index)] === 'occupied'
                  ? ['#9B4B5D']
                  : STATE_MAP[getBlockState(block, index)] === 'available'
                  ? ['#8dfa6594']
                  : ['#8C8C8CC7']
              } inset`
            : 'none',
          clipPath: block.clipPath || 'none',
        }"
        @contextmenu.prevent="showMenu($event, index)"
        @mousedown="onBlockMouseDown($event, index)"
        @mouseup="onBlockMouseUp($event, index)"
        @mouseleave="onBlockMouseLeave($event, index)"
      >
        <div
          class="label"
          :class="{ 'no-icon': !block.type }"
          :style="{
            color:
              STATE_MAP[getBlockState(block, index)] === 'occupied'
                ? ['#9B4B5D']
                : STATE_MAP[getBlockState(block, index)] === 'available'
                ? ['#8dfa6594']
                : ['#8C8C8CC7'],
          }"
        >
          <div class="zh">{{ block.title.zh }}</div>
          <div class="en">{{ block.title.en }}</div>
          <div
            v-if="block.type"
            class="icon"
            :style="{
              width: '100%',
              height: '100%',
              background: `center / contain url('/icons/${block.type}_${
                STATE_MAP[getBlockState(block, index)]
              }.png') no-repeat`,
            }"
          ></div>
        </div>
      </div>
    </vue-draggable-resizable>
    <div class="state-row">
      <div
        class="item"
        v-for="(block, index) in mapConfig.filter((b) => b.type)"
        :key="'item' + block.key"
        :style="{
          boxShadow: `0px 0px 10px 5px  ${
            STATE_MAP[getBlockState(block, index)] === 'occupied'
              ? ['#9B4B5D']
              : STATE_MAP[getBlockState(block, index)] === 'available'
              ? ['#8dfa6594']
              : ['#8C8C8CC7']
          } inset`,
          color:
            STATE_MAP[getBlockState(block, index)] === 'occupied'
              ? ['#9B4B5D']
              : STATE_MAP[getBlockState(block, index)] === 'available'
              ? ['#8dfa6594']
              : ['#8C8C8CC7'],
        }"
      >
        <div class="label no-icon">
          <div class="zh">{{ block.title.zh }}</div>
          <div class="en">{{ block.title.en }}</div>
        </div>
      </div>
    </div>
    <!-- 右键菜单 -->
    <div
      v-if="menu.visible"
      class="context-menu"
      :style="{ left: menu.x + 'px', top: menu.y + 'px' }"
    >
      <div class="menu-title">选择关联IO通道</div>
      <div class="menu-title">
        当前关联IO通道: {{ mapConfig[menu.blockIndex]?.stateKey }}
      </div>
      <div
        v-for="key in Object.keys(stateMap)"
        :key="key"
        class="menu-item"
        @click.stop="selectStateKey(menu.blockIndex, key)"
      >
        <span class="menu-key">{{ key }}</span>
        <span class="menu-value">{{
          STATE_LABEL_MAP[stateMap[key]?.value]
        }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const TS_DIFF_SECONDS = 10; // 客流统计时，持续时间的定义，单位秒
import { updateDeviceAttributes } from "@/api/device";
import {
  getCurrentDateParts,
  initVisitorCountStructure,
} from "@/utils/visitorStats";

export default {
  name: "StateMap",
  props: {
    height: {
      type: String,
      default: "17vh",
    },
    width: {
      type: String,
      default: "100%",
    },
  },
  data() {
    return {
      tbWsListener: null,
      resizing: false,
      activeBlock: null,
      longPressTimer: null,
      longPressTriggered: false,
      stateMap: {
        io_1_state: { ts: 0, value: "0" },
        io_2_state: { ts: 0, value: "0" },
        io_3_state: { ts: 0, value: "0" },
        io_4_state: { ts: 0, value: "0" },
        io_5_state: { ts: 0, value: "0" },
        io_6_state: { ts: 0, value: "0" },
        io_7_state: { ts: 0, value: "0" },
        io_8_state: { ts: 0, value: "0" },
      },
      STATE_MAP: {
        "-1": "unavailable",
        0: "available",
        1: "occupied",
      },
      STATE_LABEL_MAP: {
        "-1": "维护中",
        0: "空闲",
        1: "有人",
      },
      mapConfig: [
        {
          key: "toilet-accessible",
          title: {
            zh: "无障碍卫生间",
            en: "Accessible Toilet",
          },
          type: "toilet",
          stateKey: "io_5_state",
          lastTS: 0,
          x: 24,
          y: 9,
          w: 255,
          h: 279,
          clipPath:
            "polygon(0 0, 220px 0, 220px 115px, 100% 115px, 100% 100%, 0 100%)",
        },
        {
          key: "urinal-1",
          title: {
            zh: "小便间",
            en: "Urinal Area",
          },
          type: "urinal",
          stateKey: "io_4_state",
          lastTS: 0,
          x: 285,
          y: 119,
          w: 251,
          h: 169,
        },
        {
          key: "toilet-1",
          title: {
            zh: "厕间 I",
            en: "Toilet I",
          },
          type: "toilet",
          stateKey: "io_1_state",
          lastTS: 0,
          x: 379,
          y: 9,
          w: 156,
          h: 104,
        },
        {
          key: "toilet-2",
          title: {
            zh: "厕间 II",
            en: "Toilet II",
          },
          type: "toilet",
          stateKey: "io_2_state",
          lastTS: 0,
          x: 844,
          y: 8,
          w: 157,
          h: 125,
        },
        {
          key: "toilet-3",
          title: {
            zh: "厕间 III",
            en: "Toilet III",
          },
          type: "toilet",
          stateKey: "io_3_state",
          lastTS: 0,
          x: 845,
          y: 140,
          w: 156,
          h: 160,
        },
        {
          key: "equipment-room",
          title: {
            zh: "设备间",
            en: "Equipment Room",
          },
          lastTS: 0,
          x: 240,
          y: 10,
          w: 131,
          h: 102,
        },
        {
          key: "ad-screen",
          title: {
            zh: "广告屏",
            en: "Ad Screen",
          },
          lastTS: 0,
          x: 606,
          y: 29,
          w: 143,
          h: 41,
        },
        {
          key: "sink-area",
          title: {
            zh: "洗手池",
            en: "Sink Area",
          },
          lastTS: 0,
          x: 694,
          y: 181,
          w: 143,
          h: 41,
        },
        {
          key: "entrance-exit",
          title: {
            zh: "出入口",
            en: "Entrance & Exit",
          },
          lastTS: 0,
          x: 553,
          y: 230,
          w: 143,
          h: 41,
        },
      ],
      menu: {
        visible: false,
        x: 0,
        y: 0,
        blockIndex: null,
      },
    };
  },
  mounted() {
    document.addEventListener("click", this.hideMenu);
    const tb_mapConfig = localStorage.getItem("tb_mapConfig");
    this.mapConfig = tb_mapConfig ? JSON.parse(tb_mapConfig) : this.mapConfig;
    // 监听ThingsBoard Edge推送
    this.tbWsListener = {
      onmessage: (msg) => {
        if (msg && msg.data) {
          const ioStates = {};
          Object.keys(msg.data).forEach((k) => {
            if (/^io_\d+_state$/.test(k)) {
              const arr = msg.data[k];
              if (Array.isArray(arr) && arr.length > 0) {
                const [ts, value] = arr[arr.length - 1];
                ioStates[k] = { ts, value };
              }
            }
          });
          const typesToIncrease = new Set();
          Object.keys(ioStates).forEach((k) => {
            const { ts, value } = ioStates[k];
            const oldTs = this.stateMap[k]?.ts || 0;
            // 只在状态从有人(1)变为无人(0)且间隔大于等于TS_DIFF_SECONDS时统计
            const prevValue = this.stateMap[k]?.value;
            console.log(
              `状态变化: ${k} 从 ${prevValue} 变为 ${value}， 时间戳: ${ts}，旧时间戳: ${oldTs}，差值: ${
                Math.abs(ts - oldTs) / 1000
              }s`
            );
            if (
              (prevValue === 1 || prevValue === "1") &&
              (value === 0 || value === "0") &&
              Math.abs(ts - oldTs) >= TS_DIFF_SECONDS * 1000
            ) {
              const block = this.mapConfig.find((b) => b.stateKey === k);
              if (block && block.type) {
                typesToIncrease.add(block.type);
              }
            }
            this.$set(this.stateMap, k, { ts, value });
          });
          // 循环结束后统一上报，避免冲突，只请求一次
          if (typesToIncrease.size > 0) {
            this.increaseVisitorCountBatch(Array.from(typesToIncrease));
          }
        }
      },
    };
    this.$tbWs.addListener(this.tbWsListener);
  },
  watch: {
    mapConfig: {
      handler(val) {
        localStorage.setItem("tb_mapConfig", JSON.stringify(val));
      },
      deep: true,
    },
  },
  methods: {
    onBlockMouseDown(e, index) {
      // 只处理鼠标左键
      if (e.button === 0) {
        this.longPressTriggered = false;
        this.longPressTimer = setTimeout(() => {
          this.longPressTriggered = true;
          // 用鼠标事件的 clientX/Y
          this.showMenu(e, index);
        }, 600); // 600ms 视为长按
      }
    },
    onBlockMouseUp(e) {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
      if (this.longPressTriggered) {
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
      }
    },
    onBlockMouseLeave() {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
    },
    onDragging(index, left, top) {
      this.mapConfig[index].x = left;
      this.mapConfig[index].y = top;
    },
    onDragstop(index, left, top) {
      this.mapConfig[index].x = left;
      this.mapConfig[index].y = top;
    },
    onResizing(index, left, top, width, height) {
      this.mapConfig[index].x = left;
      this.mapConfig[index].y = top;
      this.mapConfig[index].w = width;
      this.mapConfig[index].h = height;
    },
    onResizestop(index, left, top, width, height) {
      this.mapConfig[index].x = left;
      this.mapConfig[index].y = top;
      this.mapConfig[index].w = width;
      this.mapConfig[index].h = height;
    },
    getBlockState(block) {
      if (block.stateKey && this.stateMap[block.stateKey] !== undefined) {
        return this.stateMap[block.stateKey].value;
      }
      return "0";
    },
    showMenu(e, blockIndex) {
      // 计算相对于容器的坐标，兼容页面滚动
      const container = this.$refs.container;
      let x = e.clientX,
        y = e.clientY;
      if (container) {
        const rect = container.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      this.menu.visible = true;
      this.menu.x = x;
      this.menu.y = y;
      this.menu.blockIndex = blockIndex;
    },
    hideMenu() {
      this.menu.visible = false;
    },
    selectStateKey(blockIndex, key) {
      console.log(`选择IO通道: ${key}，对应块索引: ${blockIndex}`);
      this.mapConfig[blockIndex].stateKey = key;
      this.hideMenu();
    },
    // 批量上报 visitor_count，所有 type 一次性累加
    async increaseVisitorCountBatch(types) {
      const deviceId = this.$store.getters.ioStateDeviceId;
      if (!deviceId || !Array.isArray(types) || types.length === 0) return;
      try {
        const { year, month, date } = getCurrentDateParts();
        const attrKey = "visitor_count";
        // 直接从 vuex 获取最新 visitorCount
        let visitorCount = this.$store.getters.visitorCount;
        if (!visitorCount || typeof visitorCount !== "object") {
          visitorCount = {};
        } else {
          // 深拷贝，避免直接修改 vuex state
          visitorCount = JSON.parse(JSON.stringify(visitorCount));
        }
        // 先初始化所有类型
        types.forEach((type) => {
          initVisitorCountStructure(visitorCount, year, month, date, type);
        });
        // 再批量累加
        types.forEach((type) => {
          visitorCount[year][month][date][type] += 1;
        });
        await updateDeviceAttributes(deviceId, {
          [attrKey]: JSON.stringify(visitorCount),
        });
      } catch (e) {
        console.error("批量更新visitor_count失败", e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .vdr {
  border: none;
}

.container {
  min-width: 300px;
  min-height: 200px;
  position: relative;
  margin-top: 2vh;
  background: url("@/assets/images/bg_map.png") center / cover no-repeat,
    url("@/assets/images/entrance_arrow.png") 60% 90% / 50px 100px no-repeat,
    url("@/assets/images/exit_arrow.png") 63% 100% / 50px 100px no-repeat;

  * {
    user-select: none;
  }

  .label {
    width: fit-content;
    height: 3vh;
    font-size: 1.3rem;
    line-height: 1;
    pointer-events: auto;
    display: grid;
    grid-template-columns: 1.5fr 0.5fr;
    grid-template-rows: 1fr 1fr;
    gap: 0px 0px;
    grid-template-areas:
      "zh icon"
      "en icon";
    align-items: center;
    justify-items: right;
    column-gap: 8px;

    &.no-icon {
      grid-template-columns: 1fr;
      grid-template-areas:
        "zh"
        "en";
      align-items: center;
      justify-items: center;
    }

    .icon {
      grid-area: icon;
    }
    .zh {
      grid-area: zh;
      font-size: 1.2rem;
      align-self: flex-end;
    }
    .en {
      grid-area: en;
      font-size: 0.9rem;
    }
  }
}

.block {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-row {
  width: 100%;
  height: auto;
  position: relative;
  top: 18vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .item {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 15px;
    border-radius: 16px;
    padding: 8px 20px;
  }
}
/* 右键菜单样式美化 */
.context-menu {
  position: absolute;
  z-index: 9999;
  min-width: 180px;
  background: #fff;
  border: 1.5px solid #4fd2dd;
  border-radius: 6px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.12);
  padding: 6px 0 6px 0;
  font-size: 15px;
  color: #333;
  user-select: none;
}
.menu-title {
  font-weight: bold;
  color: #4fd2dd;
  padding: 6px 16px 6px 16px;
  border-bottom: 1px solid #e6f7fa;
  margin-bottom: 4px;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.menu-item:hover {
  background: #e6f7fa;
  color: #1ca6b7;
}
.menu-key {
  font-weight: 500;
}
.menu-value {
  font-size: 13px;
  color: #888;
  margin-left: 10px;
}
</style>
