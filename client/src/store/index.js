import { createStore } from "vuex";
import home from "./modules/home";
import login from "./modules/login";
import details from "./modules/details";

export default createStore({
  // state: {},
  // mutations: {},
  // actions: {},
  modules: {
    home,
    login,
    details
  }
});
