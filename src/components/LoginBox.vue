<template>
  <div class="login-container">
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
      tenantId: "",
    };
  },
  mounted() {
    // 从 URL 查询参数读取账号密码
    const params = new URLSearchParams(window.location.search);
    const username = params.get("username");
    const password = params.get("password");
    if (username && password) {
      this.username = username;
      this.password = password;
      this.handleLogin();
    }
    this.access_token = "";
    this.$Cookie.remove("tb_access_token");
    this.$Cookie.remove("tb_refresh_token");
  },
  methods: {
    handleLogin() {
      this.loginError = "";
      if (this.username && this.password) {
        this.loading = true;
        login(this.username, this.password)
          .then(({ token, refreshToken }) => {
            // 登录成功后的处理，比如跳转页面
            this.loading = false;
            this.$emit("login-success", {
              token,
              refreshToken,
              tenantId: this.tenantId,
            });
          })
          .catch((err) => {
            // 处理登录失败
            this.loading = false;
            this.loginError =
              (err.response &&
                err.response.data &&
                err.response.data.message) ||
              "登录失败，请检查用户名和密码";
          });
      } else {
        this.loginError = "请填写用户名和密码";
      }
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
  background: url("@/assets/images/background.jpg") no-repeat center
    center/cover;
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
}
</style>
