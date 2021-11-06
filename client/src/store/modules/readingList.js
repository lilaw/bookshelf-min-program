import { listItems } from "../../utils/listItems";
export default {
  namespaced: true,
  state: () => ({
    unfinish: [],
    finish: []
  }),
  mutations: {
    setListItems(state, items){
      state.unfinish = items.filter(it => it.finishDate === null)
      state.finish = items.filter(it => it.finishDate !== null)
    }
  },
  actions: {
    fetchListItems({commit, rootState}) {
      return listItems(rootState.login.userInfo).then(res => {
        commit('setListItems', res.data)
      })
      
    }
  }
  // getters: { ... }
};
