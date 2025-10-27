import Vue from "vue";
import Vuex from "vuex";

import { parseVisitorCount } from "@/utils/visitorStats";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    message: "",
    visitorCount: {}, // 全局客流数据
    indoorEnvDeviceId: "", // 新增：室内环境设备ID
    ioStateDeviceId: "", // 新增：IO状态设备ID
    tenantId: "", // 新增：边缘设备ID
    tenantData: {}, // 新增：租户数据
    tenantUsername: "", // 新增：租户用户名
    tenantPassword: "", // 新增：租户密码
    gatewayId: "", // 新增：网关ID
    gatewayData: {
      location: "101210505", // 默认嵊州
    }, // 新增：网关数据
  },
  getters: {
    visitorCount: (state) => state.visitorCount,
    indoorEnvDeviceId: (state) => state.indoorEnvDeviceId,
    ioStateDeviceId: (state) => state.ioStateDeviceId,
    tenantId: (state) => state.tenantId,
    tenantData: (state) => state.tenantData,
    gatewayId: (state) => state.gatewayId,
    // tenantData 相关的计算属性
    edgeSerialNumber: (state) => {
      try {
        if (state.tenantData.edgeSettings && state.tenantData.edgeSettings[0]) {
          const edgeSettings = JSON.parse(state.tenantData.edgeSettings[0][1]);
          return edgeSettings.edgeId
            .split("-")
            .map((segment) => segment.charAt(0).toUpperCase())
            .join("-");
        }
        return "";
      } catch (error) {
        console.error("Error parsing edgeSerialNumber:", error);
        return "";
      }
    },
    edgeName: (state) => {
      try {
        if (state.tenantData.edgeSettings && state.tenantData.edgeSettings[0]) {
          const edgeSettings = JSON.parse(state.tenantData.edgeSettings[0][1]);
          return edgeSettings.name;
        }
        return "";
      } catch (error) {
        console.error("Error parsing edgeName:", error);
        return "";
      }
    },
    lastConnectTime: (state) => {
      try {
        if (
          state.tenantData.lastConnectTime &&
          state.tenantData.lastConnectTime[0]
        ) {
          const timeValue = state.tenantData.lastConnectTime[0][1];

          // 如果是时间戳（数字），直接使用
          if (typeof timeValue === "number") {
            return new Date(timeValue).toLocaleString();
          }

          // 如果是字符串，尝试转换成数字（时间戳）
          if (typeof timeValue === "string") {
            const numericValue = Number(timeValue);
            if (!isNaN(numericValue)) {
              return new Date(numericValue).toLocaleString();
            }
            // 如果转换数字失败，尝试直接解析字符串
            const date = new Date(timeValue);
            if (!isNaN(date.getTime())) {
              return date.toLocaleString();
            }
            // 如果都失败，返回原始字符串
            return timeValue;
          }

          // 其他情况直接返回字符串形式
          return String(timeValue);
        }
        return "";
      } catch (error) {
        console.error("Error parsing lastConnectTime:", error);
        return "";
      }
    },
    tenantUsername: (state) => state.tenantUsername,
    tenantPassword: (state) => state.tenantPassword,
    siteName: (state) => {
      return state.gatewayData.siteName || "";
    },
    siteNameEn: (state) => {
      return state.gatewayData.siteNameEn || "";
    },
    staffList: (state) => {
      return (
        JSON.parse(state.gatewayData.additionalInfo || "{}").staffList || []
      );
    },
    reviews: (state) => {
      return (
        JSON.parse(state.gatewayData.reviews || "{}") || {
          good: 0,
          moderate: 0,
          bad: 0,
        }
      );
    },
    adImage: (state) => {
      return state.gatewayData.ad || "";
    },
    location: (state) => state.gatewayData.location, // 默认嵊州
    brand: (state) => {
      return state.gatewayData.brand || "乘云";
    },
    brandEn: (state) => {
      return state.gatewayData.brandEn || "Cheng Yun";
    },
    expired: (state) => {
      return state.gatewayData.trialExpired === "true";
    },
  },
  mutations: {
    SET_MESSAGE(state, message) {
      state.message = message;
    },
    SET_VISITOR_COUNT(state, visitorCount) {
      state.visitorCount = visitorCount;
    },
    SET_INDOOR_ENV_DEVICE_ID(state, id) {
      state.indoorEnvDeviceId = id;
    },
    SET_IO_STATE_DEVICE_ID(state, id) {
      state.ioStateDeviceId = id;
    },
    SET_TENANT_ID(state, id) {
      state.tenantId = id;
    },
    SET_TENANT_DATA(state, data) {
      // data 是一个对象，包含了最新的租户数据
      state.tenantData = data;
    },
    SET_TENANT_CREDENTIALS(state, { username, password }) {
      state.tenantUsername = username;
      state.tenantPassword = password;
    },
    SET_GATEWAY_ID(state, id) {
      state.gatewayId = id;
    },
    SET_GATEWAY_DATA(state, data) {
      state.gatewayData = {
        ...state.gatewayData,
        ...data,
      };
    },
  },
  actions: {
    /**
     * 处理 ws 推送的 visitor_count 数据
     * @param {Object} context - vuex context
     * @param {Object} wsData - ws 消息体
     */
    handleWsVisitorCount({ commit }, wsData) {
      // wsData.data.visitor_count 是 [[ts, value]]
      const arr = wsData?.data?.visitor_count;
      if (Array.isArray(arr) && arr.length > 0 && arr[0].length > 1) {
        // 取最新一条
        const raw = arr[0][1];
        const visitorCount = parseVisitorCount(raw);
        commit("SET_VISITOR_COUNT", visitorCount);
      }
    },
    handleWsTenantData({ commit }, wsData) {
      const data = wsData?.data;
      commit("SET_TENANT_DATA", data);
    },
    handleWsGatewayData({ commit }, wsData) {
      // 只保留最新一条数据（latestValues 里的时间戳对应的 value）
      const data = wsData?.data;
      if (data && wsData.latestValues) {
        const result = {};
        for (const key in wsData.latestValues) {
          const ts = wsData.latestValues[key];
          if (Array.isArray(data[key])) {
            // 找到时间戳匹配的那一项
            const found = data[key].find((item) => item[0] === ts);
            if (found) {
              result[key] = found[1];
            } else {
              result[key] = "";
            }
          } else {
            result[key] = "";
          }
        }
        commit("SET_GATEWAY_DATA", result);
      } else {
        commit("SET_GATEWAY_DATA", data);
      }
    },
  },
  modules: {},
});
