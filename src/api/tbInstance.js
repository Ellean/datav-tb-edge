import axios from "axios";
import { refreshToken } from "./auth";
import Cookies from "js-cookie"; // 新增

const BASE_URL =
  process.env.VUE_APP_TB_EDGE_HOST || "https://admin.restroom.cloud"; // 修改

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
      refreshToken()
        .then(({ token: newToken }) => {
          // 重新发送失败的请求
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return instance(error.config);
        })
        .catch(async (refreshError) => {
          console.error("无法刷新Token:", refreshError);
        });
    }

    return Promise.reject(new Error(error));
  }
);

export default instance;
