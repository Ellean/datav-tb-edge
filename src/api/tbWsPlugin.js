// tbWsPlugin.js
// Vue插件：全局注入tbWsInstance，所有组件可通过this.$tbWs访问
import tbWsInstance from "./tbWsInstance";

export default {
  install(Vue) {
    Vue.prototype.$tbWs = tbWsInstance;
  },
};
