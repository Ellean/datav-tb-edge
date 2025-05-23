import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    color: ["#235FA7", "#4FD2DD"],
    reversedColor: ["#4FD2DD", "#235FA7"],
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
});
