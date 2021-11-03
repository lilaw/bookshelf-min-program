<template>
  <view class="index">
    <form class="search">
      <view class="search__row">
        <input
          type="number"
          placeholder="search"
          confirmType="done"
          v-model="keyword"
          class="search__input"
        />
        <nut-button
          form-type="submit"
          class="search__button"
          @tap="findBookByTitle"
          >搜索</nut-button
        >
      </view>
    </form>
    <view class="content-area">
      <view v-for="book in books" :key="book.title">
        <book-row :book="book" />
      </view>
    </view>
    <view class="loader">
      <text class="loader__text" v-if="isLoadingMore">Loading...</text>
    </view>
  </view>
</template>

<script>
import BookRow from "../../components/BookRow.vue";
import { computed, reactive, toRefs } from "vue";
import Taro from "@tarojs/taro";
import { useStore } from "vuex";

export default {
  name: "Index",
  setup() {
    const store = useStore();
    const state = reactive({ keyword: "" });
    // loading recommended at startup
    const fetchRecommendedBook = () => store.dispatch("home/findBook");
    fetchRecommendedBook();

    // pull down refresh
    const inst = Taro.getCurrentInstance();
    inst.page.onPullDownRefresh = () => {
      console.log("onPullDownRefresh");
      store.dispatch("home/findBook").then(Taro.stopPullDownRefresh);
    };
    // at bottom fetch more data
    inst.page.onReachBottom = () => {
      console.log("onReachBottom");
      store.commit("home/setLoadingMoreToTrue");
      store.dispatch("home/loadMoreBook");
    };

    return {
      ...toRefs(state),
      isLoading: computed(() => store.state.home.isLoading),
      isLoadingMore: computed(() => store.state.home.isLoadingMore),
      pageNum: computed(() => store.state.home.pageNum),
      books: computed(() => store.state.home.books),
      findBookByTitle: () =>
        store.dispatch("home/findBookByTitle", state.keyword)
    };
  },
  components: {
    BookRow
  }
};
</script>

<style lang="scss">
.search {
  display: block;
  padding: 20px 10px 20px 10px;
  border: 10px solid red;
  box-sizing: border-box;
  border: 1px solid red;
  position: relative;
  &__input {
    height: 25px;
    flex-grow: 1;
    padding: 0 160px 0 30px;
    border-radius: 50px;
    border: 5px solid gray;
    box-shadow: 0px 5px 10px 10px #fffe;
  }
  &__row {
    display: flex;
    border: 1px solid red;
  }
  &__button {
    position: absolute;
    right: 20px;
    top: 27px;
    height: 50px;
    width: 150px;
    padding: 20px;
    font-size: 30px;
  }
}

.content-area {
  background-color: #f6f6f6;
  padding: 10px;
  padding-top: 20px;
}
.loader {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  &__text {
    font-size: 30px;
  }
}
</style>
