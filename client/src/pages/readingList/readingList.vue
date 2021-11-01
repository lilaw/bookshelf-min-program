<script>
import { reactive, toRefs } from "vue";
import BookRow from "../../components/BookRow.vue";
import Taro from "@tarojs/taro";

export default {
  setup() {
    const state = reactive({
      tab1value: "0",
      list3: Array.from(new Array(2).keys()),
      list4: Array.from(new Array(10).keys()),
      list5: Array.from(new Array(2).keys()),
      keyword: "",
      isLoading: true,
      books: [],
    });
    // loading recommended at startup
    search();

    function search() {
      console.log("yesssss");

      Taro.cloud
        .callFunction({
          name: "books",
          data: {
            bookName: state.keyword,
          },
        })
        .then((res) => {
          console.log(res.result);
          state.books = res.result.books;
          console.log(res.result.books);
        })
        .catch((err) => {
          // handle error
          console.log(err);
        });
    }
    return {
      ...toRefs(state),
      search,
    };
  },
  components: {
    BookRow,
  },
};
</script>

<template>
  <nut-tabs v-model="tab1value" class="dfd">
    <nut-tabpane title="阅读中" class="reading">

tab1
      <view v-for="book in books" :key="book.title">
        <book-row :book="book"  size="small" />
      </view>

    </nut-tabpane>
    <nut-tabpane title="已读完" class="finish">
      Tab 2
    </nut-tabpane>
  </nut-tabs>
</template>

<style lang="scss">
.reading {

}

// override nutui default style
.nut-tabs {
  &__titles {
    height: 90px;
  }
  &__titles-item.active:before {
   width: 80px; 
   height: 5px;
  }
  &__titles-item {
    font-size: 30px;
  }
}
</style>
