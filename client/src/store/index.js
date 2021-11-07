import { createStore } from "vuex";
import home from "./modules/home";
import login from "./modules/login";
import details from "./modules/details";
import readingList from "./modules/readingList";
import createPersistedState from "vuex-persistedstate";
import Taro from "@tarojs/taro";

export default createStore({
  // state: {},
  // mutations: {},
  // actions: {},
  modules: {
    home,
    login,
    details,
    readingList
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => Taro.getStorageSync(key),
        setItem: (key, value) => Taro.setStorageSync(key, value),
        removeItem: (key) => Taro.removeStorageSync(key),
      },
    }),
  ],
});
