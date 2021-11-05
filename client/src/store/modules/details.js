import { book } from "../../utils/book";
import {
  listItem,
  createListItem,
  removeListItem,
  updateListItem
} from "../../utils/listItems";

export default {
  namespaced: true,
  state: () => ({
    isLoading: true, // loading book
    isLoadingListItem: true,
    book: {}, // book data
    listItem: {}, // listItem data like note, rate
  }),
  mutations: {
    setBook(state, book) {
      state.book = book;
      state.isLoading = false;
    },
    setListItem(state, data) {
      console.log(data);
      state.isLoadingListItem = false;
      state.listItem = data;
    },
    resetData(state) {
      state.isLoading = true
      state.isLoadingListItem = true
      state.book = {}
      state.listItem = {}
    }
  },
  actions: {
    fetchBook({ commit }, bookId) {
      return book(bookId).then(book => {
        commit("setBook", book);
      });
    },
    fetchListItem({ commit, rootState }, bookId) {
      return listItem(rootState.login.userInfo, bookId).then(res => {
        if (res.data.length > 0) commit("setListItem", res.data[0]);
      });
    },
    addToListItem({ commit, rootState, state }) {
      return createListItem(rootState.login.userInfo, state.book._id).then(
        res => {
          commit("setListItem", res.data[0]);
        }
      );
    },
    removeFromListItem({ commit, state }) {
      return removeListItem(state.listItem._id).then(() =>
        commit("setListItem", {})
      );
    },
    finishReading({state, commit}) {
      return updateListItem({finishDate: Date.now(), listItemId: state.listItem._id})
      .then(res => {
        console.log({res})
          commit("setListItem", res.data);
      })
    },
    unfinishReading({state, commit}) {
      return updateListItem({finishDate: null, listItemId: state.listItem._id})
      .then(res => {
          commit("setListItem", res.data);
      })
    },
    rateBook({state, commit}, star) {
      return updateListItem({rating: star, listItemId: state.listItem._id})
      .then(res => {
          commit("setListItem", res.data);
      })
    },
    writeNote({state, commit}, note) {
      return updateListItem({note, listItemId: state.listItem._id})
      .then(res => {
          commit("setListItem", res.data);
      })
    },
  },
  getters: {
    showAddButton(state) {
      return Object.keys(state.listItem).length === 0;
    },
    showRemoveButton(state) {
      return Object.keys(state.listItem).length !== 0;
    },
    showFinishButton(state, getter) {
      return getter.showRemoveButton && state.listItem.finishDate === null
    },
    showUnfinishButton(state, getter) {
      return getter.showRemoveButton && state.listItem.finishDate !== null
    },
    review(state) {
      return state.listItem.rate
    },
    note(state) {
      return state.listItem.note
    }

  }
};
