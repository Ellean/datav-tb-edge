import Cookies from "js-cookie";
<template>
  <div
    class="container"
    ref="container"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <vue-draggable-resizable
      v-for="(block, index) in mapConfig"
      :key="block.key"
      :x="block.x"
      :y="block.y"
      :w="block.w"
      :h="block.h"
      @dragging="onDragging(index, ...arguments)"
      @dragstop="onDragstop(index, ...arguments)"
      @resizing="onResizing(index, ...arguments)"
      @resizestop="onResizestop(index, ...arguments)"
    >
      <!-- parent -->
      <div
        class="block"
        :style="{
          width: '100%',
          height: '100%',
          background: `center / 60px url('/icons/${block.type}-${
            STATE_MAP[getBlockState(block, index)]
          }.png') no-repeat`,
        }"
        @click="loopState(index, getBlockState(block, index))"
        @contextmenu.prevent="showMenu($event, index)"
        @mousedown="onBlockMouseDown($event, index)"
        @mouseup="onBlockMouseUp($event, index)"
        @mouseleave="onBlockMouseLeave($event, index)"
      >
        <dvBorderBox7
          :color="
            STATE_MAP[getBlockState(block, index)] === 'occupied'
              ? ['#FFB02BD6']
              : STATE_MAP[getBlockState(block, index)] === 'available'
              ? ['#8DFA65']
              : ['#8C8C8CC7']
          "
        >
          <div
            class="text"
            :style="{
              color:
                STATE_MAP[getBlockState(block, index)] === 'occupied'
                  ? ['#FFB02BD6']
                  : STATE_MAP[getBlockState(block, index)] === 'available'
                  ? ['#8DFA65']
                  : ['#8C8C8CC7'],
            }"
          >
            {{ STATE_LABEL_MAP[getBlockState(block, index)] }}
          </div>
        </dvBorderBox7>
      </div>
    </vue-draggable-resizable>
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
import Cookies from "js-cookie";

export default {
  name: "StateMap",
  props: {
    height: {
      type: Number,
      default: 600,
    },
    width: {
      type: Number,
      default: 400,
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
          key: "toilet-1",
          x: 0,
          y: 200,
          w: 60,
          h: 200,
          type: "toilet",
          stateKey: null,
          lastTS: 0,
        },
        {
          key: "urinal-1",
          x: 0,
          y: 0,
          w: 60,
          h: 200,
          type: "urinal",
          stateKey: null,
          lastTS: 0,
        },
        {
          key: "toilet-3",
          x: 180,
          y: 0,
          w: 60,
          h: 280,
          type: "toilet",
          stateKey: null,
          lastTS: 0,
        },
        {
          key: "toile-4",
          x: 240,
          y: 0,
          w: 60,
          h: 280,
          type: "toilet",
          stateKey: null,
          lastTS: 0,
        },
        {
          key: "sink",
          x: 144,
          y: 0,
          w: 36,
          h: 280,
          type: "sink",
          stateKey: null,
          lastTS: 0,
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
    const tb_mapConfig = Cookies.get("tb_mapConfig");
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
        Cookies.set("tb_mapConfig", JSON.stringify(val), { expires: 365 });
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
      document.removeEventListener("click", this.hideMenu);
    },
    selectStateKey(blockIndex, key) {
      console.log(`选择IO通道: ${key}，对应块索引: ${blockIndex}`);
      this.mapConfig[blockIndex].stateKey = key;
      this.hideMenu();
    },
    loopState(index, state) {
      const _state = Number(state);
      this.mapConfig[index].state = _state < 0 ? "0" : "-1";
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
.container {
  min-width: 300px;
  min-height: 200px;
  position: relative;
  user-select: none;
}
.block {
  width: 100%;
  height: 100%;
  .text {
    font-size: 18px;
    padding: 12px;
    pointer-events: auto;
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
