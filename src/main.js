import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import dataV from "@jiaminghi/data-view";
import tbWsPlugin from "@/api/tbWsPlugin";
import Cookie from "js-cookie";
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import { getQueryParam } from "@/utils/url";

Vue.prototype.$Cookie = Cookie;
Vue.component("VueDraggableResizable", VueDraggableResizable);

Vue.use(dataV);
Vue.use(tbWsPlugin);

Vue.config.productionTip = false;

// 从URL参数获取设备ID并存入Vuex
const indoorEnvDeviceId =
  process.env.VUE_APP_INDOOR_ENV_DEVICE_ID ||
  getQueryParam("indoorEnvDeviceId");
const ioStateDeviceId =
  process.env.VUE_APP_IO_STATE_DEVICE_ID || getQueryParam("ioStateDeviceId");
const tenantId = process.env.VUE_APP_TENANT_ID || getQueryParam("tenantId");
const username = process.env.VUE_APP_USERNAME || getQueryParam("username");
const password = process.env.VUE_APP_PASSWORD || getQueryParam("password");
if (tenantId) {
  store.commit("SET_TENANT_ID", tenantId);
}
if (indoorEnvDeviceId) {
  store.commit("SET_INDOOR_ENV_DEVICE_ID", indoorEnvDeviceId);
}
if (ioStateDeviceId) {
  store.commit("SET_IO_STATE_DEVICE_ID", ioStateDeviceId);
}
if (username && password) {
  store.commit("SET_TENANT_CREDENTIALS", { username, password });
}

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
