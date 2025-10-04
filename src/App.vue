<template>
  <div class="main-container">
    <!-- 全屏加载动画遮罩 -->
    <div v-if="loading" class="fullscreen-loading">
      <div class="loader"></div>
    </div>
    <LoginBox
      v-if="!access_token"
      ref="loginBox"
      :disabled="disabled"
      @login-success="toShowMain"
    ></LoginBox>
    <HeaderBar v-if="access_token"></HeaderBar>
    <MainBlock v-if="access_token"></MainBlock>
  </div>
</template>

<script>
import { refreshToken } from "@/api/auth";

import HeaderBar from "./components/HeaderBlock.vue";
import MainBlock from "./components/MainBlock.vue";
import LoginBox from "./components/LoginBox.vue";

export default {
  name: "App",
  components: {
    HeaderBar,
    MainBlock,
    LoginBox,
  },
  data() {
    return {
      access_token: "",
      disabled: false,
      tbWsListener: null,
      loading: true, // 控制全屏加载动画显示
    };
  },
  mounted() {
    // 校验必要参数
    const indoorEnvDeviceId = this.$store.getters.indoorEnvDeviceId;
    const ioStateDeviceId = this.$store.getters.ioStateDeviceId;
    const tenantId = this.$store.getters.tenantId;
    const gatewayId = this.$store.getters.gatewayId;
    if (!indoorEnvDeviceId || !ioStateDeviceId || !tenantId || !gatewayId) {
      this.disabled = true;
      this.loading = false;
      this.$message &&
        this.$message.error &&
        this.$message.error(
          "缺少必要设备ID参数，请通过URL传入indoorEnvDeviceId和ioStateDeviceId和tenantId和gatewayId"
        );
      return;
    }
    refreshToken()
      .then((res) => {
        // 加载完成后关闭 loading
        this.loading = false;
        if (res && res.token) {
          this.initWS(res.token);
          this.toShowMain({ token: res.token });
        } else {
          console.error("刷新 token 失败，重新登录");
          this.access_token = "";
          this.$Cookie.remove("tb_access_token");
          this.$Cookie.remove("tb_refresh_token");
        }
      })
      .catch((err) => {
        console.error("刷新 token 失败，重新登录", err);
        this.access_token = "";
        this.$Cookie.remove("tb_access_token");
        this.$Cookie.remove("tb_refresh_token");
        this.$nextTick(() => {
          const loginBox = this.$refs.loginBox;
          console.log("触发登录", loginBox);
          loginBox &&
            loginBox.handleLogin((token) => {
              this.loading = false;
              this.initWS(token);
            });
        });
      });
  },
  methods: {
    toShowMain({ token }) {
      this.access_token = token;
    },
    initWS(token) {
      const indoorEnvDeviceId = this.$store.getters.indoorEnvDeviceId;
      const ioStateDeviceId = this.$store.getters.ioStateDeviceId;
      const tenantId = this.$store.getters.tenantId;
      const gatewayId = this.$store.getters.gatewayId;
      if (!indoorEnvDeviceId || !ioStateDeviceId || !tenantId || !gatewayId) {
        this.$message &&
          this.$message.error &&
          this.$message.error(
            "缺少必要设备ID参数，请通过URL传入indoorEnvDeviceId和ioStateDeviceId和tenantId和gatewayId"
          );
        this.access_token = "";
        this.$Cookie.remove("tb_access_token");
        this.$Cookie.remove("tb_refresh_token");
        return;
      }
      this.$tbWs.send({
        authCmd: {
          cmdId: 0,
          token,
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
          {
            type: "ATTRIBUTES",
            entityType: "DEVICE",
            entityId: gatewayId,
            scope: "SERVER_SCOPE",
            cmdId: 5,
          },
        ],
      });
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
          if (msg && msg.subscriptionId === 5 && msg.data) {
            this.$store.dispatch("handleWsGatewayData", msg);
          }
        },
      };
      this.$tbWs.addListener(this.tbWsListener);
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

.main-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: url("@/assets/images/bg_2.png") bottom 7vh left 0px / contain
      no-repeat,
    url("@/assets/images/bg_1.png") top 17vh left 0px / contain no-repeat,
    #193281;
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

[class$="-en"] {
  font-size: 0.8rem;
}

[class$="-zh"] {
  font-size: 1.2rem;
}

.fullscreen-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.loader {
  width: 60px;
  height: 60px;
  border: 6px solid #409eff;
  border-top: 6px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
