<script>
import { computed, reactive, toRefs } from "vue";
import BookRow from "../../components/BookRow.vue";
import Taro from "@tarojs/taro";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const state = reactive({
      tab1value: "0"
    });
    // loading recommended at startup
    const finish = computed(() => store.state.readingList.finish);
    const unfinish = computed(() => store.state.readingList.unfinish);
    
    store.dispatch("readingList/fetchListItems");

    const inst = Taro.getCurrentInstance();
    inst.page.onPullDownRefresh = () => {
      store
        .dispatch("readingList/fetchListItems")
        .then(Taro.stopPullDownRefresh);
    };
    inst.page.onTabItemTap = () => store.dispatch("readingList/fetchListItems");
    return {
      ...toRefs(state),
      finish,
      unfinish
    };
  },
  components: {
    BookRow
  },
};
</script>

<template>
  <nut-tabs v-model="tab1value" >
    <nut-tabpane title="阅读中" class="reading">
      <view v-for="unf in unfinish" :key="unf.book.title">
        <book-row :book="unf.book" size="small" />
      </view>
    </nut-tabpane>
    <nut-tabpane title="已读完" class="finish">
      <view v-for="fin in finish" :key="fin.book.title">
        <book-row :book="fin.book" size="small" />
      </view>
    </nut-tabpane>
  </nut-tabs>
</template>

<style lang="scss">

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
