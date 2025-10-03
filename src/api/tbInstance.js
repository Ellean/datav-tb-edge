import axios from "axios";
import { refreshToken } from "./auth";
import Cookies from "js-cookie"; // 新增

const BASE_URL =
  "http://" + process.env.VUE_APP_TB_EDGE_HOST || "http://100.84.125.65:8080";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = Cookies.get("tb_access_token"); // 修改
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        const { token: newToken } = await refreshToken();

        // 重新发送失败的请求
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return instance(error.config);
      } catch (refreshError) {
        console.error("无法刷新Token:", refreshError);
        // 处理刷新失败（例如跳转到登录页面）
      }
    }

    return Promise.reject(new Error(error));
  }
);

export default instance;
