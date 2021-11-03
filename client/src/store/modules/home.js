import { bookSearch } from "../../utils/book";
export default {
  namespaced: true,
  state: () => ({
    isLoading: true, // loading data in first render
    isLoadingMore: false, // Infinite loading list state
    pageNum: 1, // what is number of page on loaded books
    books: [] // book data
  }),
  mutations: {
    setLoadingMoreToTrue(state) {
      state.isLoadingMore = true;
    },
    setLoadingMoreToFalse(state) {
      state.isLoadingMore = false;
    },
    updateGlobalScreenLoading(state, loading) {
      state.isLoading = loading;
    },
    setBooks(state, newBooks) {
      state.books = newBooks;
    },
    addMoreBooks(state, { newBooks, currPage }) {
      state.books = [...state.books, ...newBooks];
      state.pageNum = currPage;
    }
  },
  actions: {
    findBook(context, { query, pageNum } = { query: "", pageNum: 0 }) {
      console.log("searchig");
      return bookSearch({ query, pageNum }).then(res => {
        context.commit("setBooks", res.books);
      });
    },
    findBookByTitle(context, keyword) {
      return context.dispatch("findBook", { query: keyword });
    },
    loadMoreBook(context) {
      context.commit("setLoadingMoreToTrue");
      bookSearch({ pageNum: context.state.pageNum }).then(res => {
        context.commit("addMoreBooks", {
          newBooks: res.books,
          currPage: res.dataInPage
        });
        context.commit("setLoadingMoreToFalse");
      });
    }
  }
  // getters: { ... }
};
