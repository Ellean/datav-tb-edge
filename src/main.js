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
const indoorEnvDeviceId = getQueryParam("indoorEnvDeviceId");
const ioStateDeviceId = getQueryParam("ioStateDeviceId");
const tenantId = getQueryParam("tenantId");
if (tenantId) {
  store.commit("SET_TENANT_ID", tenantId);
}
if (indoorEnvDeviceId) {
  store.commit("SET_INDOOR_ENV_DEVICE_ID", indoorEnvDeviceId);
}
if (ioStateDeviceId) {
  store.commit("SET_IO_STATE_DEVICE_ID", ioStateDeviceId);
}

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
