import {login} from "../../utils/auth"
export default {
  namespaced: true,
  state: () => ({
    hasLogged: false,
    userInfo: {}
  }),
  mutations: {
    setUser(state, userInfo) {
      state.hasLogged = true,
      state.userInfo = userInfo
    }
  },
  actions: {
    login({commit}) {
      return login().then(res => {
        commit("setUser", res.data)
      })
    }
  }
  // getters: { ... }
};
