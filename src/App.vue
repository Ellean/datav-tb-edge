<template>
  <dvFullScreenContainer>
    <LoginBox
      v-if="!access_token"
      :disabled="disabled"
      @login-success="toShowMain"
    ></LoginBox>
    <HeaderBar v-if="access_token"></HeaderBar>
    <MainBlock v-if="access_token"></MainBlock>
  </dvFullScreenContainer>
</template>

<script>
import { refreshToken } from "@/api/auth";

import HeaderBar from "./components/HeaderBlock.vue";
import MainBlock from "./components/MainBlock.vue";
import LoginBox from "./components/LoginBox.vue";

export default {
  name: "App",
  components: { HeaderBar, MainBlock, LoginBox },
  data() {
    return {
      access_token: "",
      disabled: false,
      tbWsListener: null,
    };
  },
  watch: {
    access_token(newVal) {
      if (newVal) {
        const indoorEnvDeviceId = this.$store.getters.indoorEnvDeviceId;
        const ioStateDeviceId = this.$store.getters.ioStateDeviceId;
        const tenantId = this.$store.getters.tenantId;
        if (!indoorEnvDeviceId || !ioStateDeviceId || !tenantId) {
          this.$message &&
            this.$message.error &&
            this.$message.error(
              "缺少必要设备ID参数，请通过URL传入indoorEnvDeviceId和ioStateDeviceId和tenantId"
            );
          this.access_token = "";
          this.$Cookie.remove("tb_access_token");
          this.$Cookie.remove("tb_refresh_token");
          return;
        }
        this.$tbWs.send({
          authCmd: {
            cmdId: 0,
            token: newVal,
          },
          cmds: [
            {
              type: "TIMESERIES",
              entityType: "DEVICE",
              entityId: indoorEnvDeviceId,
              scope: "LATEST_TELEMETRY",
              cmdId: 1,
            },
            {
              type: "TIMESERIES",
              entityType: "DEVICE",
              entityId: ioStateDeviceId,
              scope: "LATEST_TELEMETRY",
              cmdId: 2,
            },
            {
              type: "ATTRIBUTES",
              entityType: "DEVICE",
              entityId: ioStateDeviceId,
              scope: "SERVER_SCOPE",
              cmdId: 3,
            },
            {
              type: "ATTRIBUTES",
              entityType: "TENANT",
              entityId: tenantId,
              scope: "SERVER_SCOPE",
              cmdId: 4,
            },
          ],
        });
      }
    },
  },
  async mounted() {
    // 校验必要参数
    const indoorEnvDeviceId = this.$store.getters.indoorEnvDeviceId;
    const ioStateDeviceId = this.$store.getters.ioStateDeviceId;
    const tenantId = this.$store.getters.tenantId;
    if (!indoorEnvDeviceId || !ioStateDeviceId || !tenantId) {
      this.disabled = true;
      this.$message &&
        this.$message.error &&
        this.$message.error(
          "缺少必要设备ID参数，请通过URL传入indoorEnvDeviceId和ioStateDeviceId和tenantId"
        );
      return;
    }
    const { token } = await refreshToken();
    this.access_token = token;
    if (this.access_token) {
      this.tbWsListener = {
        onmessage: (msg) => {
          // 只处理 subscriptionId=3 且有 visitor_count 的 ws 数据
          if (
            msg &&
            msg.subscriptionId === 3 &&
            msg.data &&
            msg.data.visitor_count
          ) {
            this.$store.dispatch("handleWsVisitorCount", msg);
          }
          if (msg && msg.subscriptionId === 4 && msg.data) {
            this.$store.dispatch("handleWsTenantData", msg);
          }
        },
      };
      this.$tbWs.addListener(this.tbWsListener);
    } else {
      this.access_token = "";
      this.$Cookie.remove("tb_access_token");
      this.$Cookie.remove("tb_refresh_token");
    }
  },
  methods: {
    toShowMain({ token }) {
      this.access_token = token;
    },
  },
  beforeDestroy() {
    if (this.tbWsListener) {
      this.$tbWs.removeListener(this.tbWsListener);
    }
  },
};
</script>

<style lang="scss">
@import "@/assets/qweather-icons.css";

body {
  margin: 0;
  padding: 0;
  color: white;
  font-family: "Source Han Sans CN", sans-serif;
}

#dv-full-screen-container {
  background: center / 100% 100% url("@/assets/images/background.jpg") no-repeat;
  &::after {
    content: ""; /* 必须设置内容 */
    position: absolute; /* 绝对定位 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0e1f2ca5; /* 半透明黑色 */
    z-index: -1; /* 确保在背景图之上 */
  }
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
