import instance from "./tbInstance";
import Cookies from "js-cookie";

/**
 * 登录 ThingsBoard
 * @param {string} username 用户名（邮箱）
 * @param {string} password 密码
 * @returns {Promise<{token: string, refreshToken: string}>}
 */
/**
 * @param {string} username
 * @param {string} password
 * @param {object} [options] 额外 axios 配置，如 { timeout: 10000 }
 */
export function login(username, password, options = {}) {
  return instance
    .post(
      "/api/auth/login",
      { username, password },
      { timeout: 10000, ...options }
    )
    .then((res) => {
      const { token, refreshToken } = res.data;
      Cookies.set("tb_access_token", token);
      Cookies.set("tb_refresh_token", refreshToken);
      return { token, refreshToken };
    });
}

/**
 * 刷新 ThingsBoard token
 * @returns {Promise<{token: string, refreshToken: string}>}
 */
export function refreshToken() {
  const refreshToken = Cookies.get("tb_refresh_token");
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token found"));
  }
  return instance.post("/api/auth/token", { refreshToken }).then((res) => {
    const { token, refreshToken: newRefreshToken } = res.data;
    Cookies.set("tb_access_token", token);
    Cookies.set("tb_refresh_token", newRefreshToken);
    return { token, refreshToken: newRefreshToken };
  });
}
