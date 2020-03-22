import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    loading: false,
  },
  mutations: {
    openLoading (state) {
      state.loading = true;
    },
    offLoading (state) {
      state.loading = false;
    }
  },
  actions: {

  }
})
