<template>
  <div class="login-container">
    <!-- 登录专用遮罩动画，仅第一次超时前显示 -->
    <transition name="fade">
      <div v-if="showLoginMask && loading" class="login-mask">
        <div class="login-mask-spinner"></div>
        <div class="login-mask-text">正在验证身份，请稍候...</div>
      </div>
    </transition>
    <!-- 系统启动动画，进度条 -->
    <transition name="fade">
      <div v-if="showStartup" class="startup-mask">
        <div class="startup-title">系统启动中，请耐心等待</div>
        <div class="startup-progress-bar">
          <div
            class="startup-progress-inner"
            :style="{ width: startupPercent + '%' }"
          ></div>
        </div>
        <div class="startup-percent">{{ percentText(startupPercent) }}</div>
      </div>
    </transition>
    <div class="overlay"></div>
    <div class="login-box">
      <h2 class="login-title">欢迎登录乘云智慧引导系统</h2>
      <form @submit.prevent="handleLogin" autocomplete="on">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            v-model="username"
            type="text"
            id="username"
            name="username"
            placeholder="请输入用户名"
            required
            autocomplete="username"
            :disabled="loading || disabled"
            @mousemove="onInputMouseMove($event, 'username')"
            @mouseleave="onInputMouseLeave('username')"
            :style="inputHighlightStyle('username')"
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            v-model="password"
            type="password"
            id="password"
            name="password"
            placeholder="请输入密码"
            required
            autocomplete="current-password"
            :disabled="loading || disabled"
            @mousemove="onInputMouseMove($event, 'password')"
            @mouseleave="onInputMouseLeave('password')"
            :style="inputHighlightStyle('password')"
          />
        </div>
        <div style="height: 24px">{{ loginError }}</div>
        <button
          type="submit"
          class="login-button"
          :disabled="loading || disabled"
          @mousemove="onBtnMouseMove"
          @mouseleave="onBtnMouseLeave"
          :style="btnHighlightStyle"
        >
          <span v-if="loading" class="btn-spinner"></span>
          <span v-if="!loading">登录</span>
          <span v-else style="margin-left: 8px">登录中...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/auth";

export default {
  name: "LoginBox",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      username: "",
      password: "",
      inputHighlights: {
        username: { x: "100%", y: "100%", active: false },
        password: { x: "100%", y: "100%", active: false },
      },
      btnHighlight: { x: "100%", y: "100%", active: false },
      loginError: "",
      showLoginMask: false, // 登录专用遮罩动画
      showStartup: false, // 系统启动动画
      startupPercent: 0, // 启动进度百分比
      startupInterval: null, // 进度条interval
      loginTimeoutCount: 0, // 超时次数
      loginTimeoutId: null, // 登录超时定时器
    };
  },
  mounted() {
    this.username = this.$store.getters.tenantUsername;
    this.password = this.$store.getters.tenantPassword;
  },
  methods: {
    percentText(val) {
      if (!val) return "0%";
      if (val >= 100) return "100%";
      return val.toFixed(1) + "%";
    },
    handleLogin(cb) {
      this.loginError = "";
      if (!this.username || !this.password) {
        this.loginError = "请填写用户名和密码";
        return;
      }
      // 只在第一次超时前显示遮罩
      if (this.loginTimeoutCount === 0) {
        this.showLoginMask = true;
      }
      this.loading = true;
      // 登录请求，超时交由 axios 处理
      login(this.username, this.password, { timeout: 10000 })
        .then(({ token, refreshToken }) => {
          this.loading = false;
          this.showLoginMask = false;
          this.showStartup = false;
          this.loginTimeoutCount = 0;
          this.$emit("login-success", { token, refreshToken });
          cb && cb(token);
        })
        .catch((err) => {
          this.loading = false;
          this.showLoginMask = false;
          // 判断是否为超时
          if (
            err.code === "ECONNABORTED" ||
            (err.message && err.message.includes("timeout"))
          ) {
            this.handleLoginTimeout();
          } else {
            this.loginError =
              (err.response &&
                err.response.data &&
                err.response.data.message) ||
              "登录失败，请检查用户名和密码";
          }
        });
    },

    handleLoginTimeout() {
      this.loading = false;
      this.showLoginMask = false;
      this.loginTimeoutCount += 1;
      // 第一次超时，显示系统启动动画
      if (this.loginTimeoutCount === 1) {
        this.showStartup = true;
        this.startupPercent = 0;
        this.startStartupProgress();
      }
      // 自动重试登录
      setTimeout(() => {
        this.handleLogin();
      }, 10000); // 稍作延迟再重试
    },

    startStartupProgress() {
      if (this.startupInterval) clearInterval(this.startupInterval);
      // 8分钟 = 480秒，进度每秒递增 100/480
      const totalSeconds = 480;
      const step = 100 / totalSeconds;
      this.startupInterval = setInterval(() => {
        if (this.startupPercent < 100) {
          this.startupPercent = Math.min(100, this.startupPercent + step);
        } else {
          clearInterval(this.startupInterval);
        }
      }, 1000);
    },
    // 按钮高亮
    onBtnMouseMove(e) {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.btnHighlight = {
        x: `${x}px`,
        y: `${y}px`,
        active: true,
      };
    },
    onBtnMouseLeave() {
      this.btnHighlight = {
        x: "50%",
        y: "50%",
        active: false,
      };
    },
    // 输入框高亮
    onInputMouseMove(e, field) {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.inputHighlights[field] = {
        x: `${x}px`,
        y: `${y}px`,
        active: true,
      };
    },
    onInputMouseLeave(field) {
      this.inputHighlights[field] = {
        x: "50%",
        y: "50%",
        active: false,
      };
    },
    inputHighlightStyle(field) {
      const { x, y, active } = this.inputHighlights[field];
      return {
        "--input-x": x,
        "--input-y": y,
        "--input-highlight": active ? 1 : 0,
      };
    },
  },
  computed: {
    btnHighlightStyle() {
      const { x, y, active } = this.btnHighlight;
      return {
        "--x": x,
        "--y": y,
        "--btn-highlight": active ? 1 : 0,
      };
    },
  },
  onDestroy() {
    if (this.startupInterval) clearInterval(this.startupInterval);
    if (this.loginTimeoutId) clearTimeout(this.loginTimeoutId);
  },
};
</script>

<style lang="scss" scoped>
/* 主容器 */
.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;

  /* 遮罩层 */
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    z-index: 1;
  }
}

/* 登录专用遮罩动画 */
.login-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .login-mask-spinner {
    width: 60px;
    height: 60px;
    border: 6px solid #00f2fe;
    border-top: 6px solid #fff;
    border-radius: 50%;
    animation: btn-spin 1s linear infinite;
    margin-bottom: 24px;
  }
  .login-mask-text {
    color: #fff;
    font-size: 1.2rem;
    letter-spacing: 2px;
    text-shadow: 0 0 8px #00f2fe;
  }
}

/* 系统启动动画 */
.startup-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.92);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .startup-title {
    color: #fff;
    font-size: 1.3rem;
    margin-bottom: 32px;
    letter-spacing: 2px;
    text-shadow: 0 0 8px #00f2fe;
  }
  .startup-progress-bar {
    width: 320px;
    height: 18px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 9px;
    overflow: hidden;
    margin-bottom: 18px;
    box-shadow: 0 0 8px #00f2fe;
  }
  .startup-progress-inner {
    height: 100%;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    transition: width 1s linear;
  }
  .startup-percent {
    color: #fff;
    font-size: 1.1rem;
    text-shadow: 0 0 8px #00f2fe;
  }

  /* 遮罩淡入淡出动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}

/* 登录框 */
.login-box {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
  color: #fff;

  /* 标题 */
  .login-title {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  }
}

/* 表单组 */
.form-group {
  margin-bottom: 1.5rem;
  text-align: left;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #ddd;
  }

  input {
    width: calc(100% - 2rem);
    padding: 0.75rem;
    font-size: 1rem;
    border: none;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    outline: none;
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
    transition: box-shadow 0.3s;
    position: relative;
    z-index: 1;
    // 动态高亮特效
    background-image: radial-gradient(
      circle at var(--input-x, 50%) var(--input-y, 50%),
      rgba(0, 255, 255, 0.25) 0%,
      rgba(0, 255, 255, 0.1) 40%,
      transparent 80%
    );
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // 控制高亮显示
    opacity: 1;
    &::placeholder {
      color: #eee;
      opacity: 0.7;
    }

    // 兼容自动填充样式
    &:-webkit-autofill,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.2) inset !important;
      box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.2) inset !important;
      -webkit-text-fill-color: #fff !important;
      color: #fff !important;
      transition: background-color 5000s ease-in-out 0s;
      background-image: radial-gradient(
        circle at var(--input-x, 50%) var(--input-y, 50%),
        rgba(0, 255, 255, 0.25) 0%,
        rgba(0, 255, 255, 0.1) 40%,
        transparent 80%
      ) !important;
      background-repeat: no-repeat !important;
      background-size: 100% 100% !important;
    }
  }
}

/* 登录按钮 */
.login-button {
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s, transform 0.2s;
  box-shadow: 0 4px 15px rgba(0, 255, 255, 0.4);
  margin-top: 24px;
  position: relative;
  overflow: hidden;
  outline: none;

  // 动态高亮特效
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background: radial-gradient(
      circle at var(--x, 50%) var(--y, 50%),
      #00f2fe 0%,
      #4facfe 40%,
      transparent 80%
    );
    opacity: var(--btn-highlight, 0);
    transition: opacity 0.2s;
    z-index: 1;
  }

  &:hover::before {
    opacity: 0.5;
  }

  // 按钮 loading 动画
  .btn-spinner {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid #fff;
    border-top: 2px solid #4facfe;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 8px;
    animation: btn-spin 0.8s linear infinite;
  }
  @keyframes btn-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
