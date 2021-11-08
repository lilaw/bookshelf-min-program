<script>
import { computed, reactive, toRefs, watch, onUnmounted } from "vue";
import Taro from "@tarojs/taro";
import { useStore } from "vuex";
import debounceFn from "debounce-fn";

export default {
  setup() {
    const store = useStore();
    const state = reactive({
      imgPreviewItem: [],
      rating: -1,
      note: "",
      isShowSynopsis: false
    });
    const inst = Taro.getCurrentInstance();
    const book = computed(() => store.state.details.book);
    const addToListItem = () =>
      store
        .dispatch("details/addToListItem")
        .catch(err => Notify.warn(err.message));
    const removeFromListItem = () =>
      store
        .dispatch("details/removeFromListItem")
        .catch(err => Notify.warn(err.message));
    const finishReading = () =>
      store
        .dispatch("details/finishReading")
        .catch(err => Notify.warn(err.message));
    const unfinishReading = () =>
      store
        .dispatch("details/unfinishReading")
        .catch(err => Notify.warn(err.message));

    const review = computed(() => store.getters["details/review"]);
    const updateReview = () =>
      store.dispatch("details/rateBook", state.rating).catch(() => {
        Taro.showToast({
          title: "网络失败",
          duration: 2000
        });
        // restore previous value
        state.rating = review.value;
      });
    const note = computed(() => store.getters["details/note"]);
    const writeNote = () => store.dispatch("details/writeNote", state.note);
    const debounceWriteNote = debounceFn(writeNote, { wait: 2000 });

    watch(book, book => {
      state.imgPreviewItem = [book.coverImageUrl];
      Taro.setNavigationBarTitle({title: book.title})
    });
    watch(review, rating => (state.rating = rating));
    watch(note, note => (state.note = note));

    // load data at startujp
    store.dispatch("details/fetchBook", inst.router.params.bookId);
    store.dispatch("details/fetchListItem", inst.router.params.bookId);

    onUnmounted(() => {
      store.commit("details/resetData");
    });

    function showImgPreview() {
      Taro.previewImage({
        current: state.imgPreviewItem[0], // 当前显示图片的http链接
        urls: state.imgPreviewItem // 需要预览的图片http链接列表
      });
    }

    function openSynopsis() {
      state.isShowSynopsis = true;
    }

    return {
      ...toRefs(state),
      isLoading: computed(() => store.state.details.isLoading),
      isLoadingListItem: computed(() => store.state.details.isLoadingListItemk),
      showAddButton: computed(() => store.getters["details/showAddButton"]),
      showRemoveButton: computed(
        () => store.getters["details/showRemoveButton"]
      ),
      showFinishButton: computed(
        () => store.getters["details/showFinishButton"]
      ),
      showUnfinishButton: computed(
        () => store.getters["details/showUnfinishButton"]
      ),
      addToListItem,
      removeFromListItem,
      finishReading,
      unfinishReading,
      updateReview,
      debounceWriteNote,
      writeNote,
      book,
      showImgPreview,
      openSynopsis
    };
  },
  onLoad(query) {
    console.log(query);
  }
};
</script>

<template>
  <view>
    <view :class="{ details: true, 'disable-scroll': isShowSynopsis }" v-if="!isLoading">
      <view class="details__head-area">
        <image
          :src="book.coverImageUrl"
          :alt="`${book.title} cover`"
          class="book-detail__cover"
          @tap="showImgPreview"
        />
        <view class="details__title-and-author-area">
          <text class="book-detail__title">{{ book.title }}</text>
          <text class="book-detail__author">{{ book.author }}</text>
          <text class="book-detail__publisher">{{ book.publisher }}</text>

          <view class="details__control-area" v-if="!isLoadingListItem">
            <nut-button
              shape="square"
              type="primary"
              class="button button__add"
              v-if="showAddButton"
              @tap="addToListItem"
              >Add</nut-button
            >
            <nut-button
              shape="square"
              type="primary"
              class="button button__remove"
              v-if="showRemoveButton"
              @tap="removeFromListItem"
              >Remove</nut-button
            >
            <nut-button
              shape="square"
              type="primary"
              class="button button__finish"
              v-if="showFinishButton"
              @tap="finishReading"
              >Finish</nut-button
            >
            <nut-button
              shape="square"
              type="primary"
              class="button button__unfinish"
              v-if="showUnfinishButton"
              @tap="unfinishReading"
              >Unfinish</nut-button
            >
          </view>
        </view>
      </view>
      <view class="details__meta-area">
        <view class="meta__book-type">
          <image src="/images/book.svg" class="icon__ebook" />
          Ebook</view
        >
        <view class="meta__book-pages"
          ><text>{{ book.pageCount }}</text> Pages</view
        >
      </view>
      <view class="details__synopsis-area">
        <text class="synopsis__heading heading">About this ebook</text>
        <nut-icon
          name="right"
          class="synopsis__more-icon"
          @tap="openSynopsis"
        ></nut-icon>
        <text class="synopsis__content"
          >{{ book.synopsis.slice(0, 200) }}...</text
        >
      </view>

      <block v-if="showRemoveButton">
        <view class="details__rate-area">
          <text class="rate__heading heading">Rate this book</text>
          <nut-rate
            :total="6"
            v-model="rating"
            active-color="#59A5F0"
            spacing="50"
            class="rate_stars"
            @change="updateReview"
          />
        </view>
        <view class="details__note-area">
          <text class="note__heading heading">Note: </text>
          <nut-textarea
            v-model="note"
            rows="10"
            autosize
            class="note__textarea"
            @blur="writeNote"
            @change="debounceWriteNote"
          />
        </view>
      </block>

      <nut-popup
        position="bottom"
        closeable
        round
        pop-class="synopsis__popup"
        v-model:visible="isShowSynopsis"
        ><text>{{ book.synopsis }}</text></nut-popup
      >
    </view>
  </view>
</template>

<style lang="scss">
.details {
  width: 100vw;
  padding: 30px;
  box-sizing: border-box;

  &__head-area {
    display: flex;
    padding: 20px;
  }
  &__title-and-author-area {
    display: flex;
    flex-direction: column;
  }
  &__meta-area {
    margin-top: 20px;
    display: flex;
    & > view:first-child {
      border-right: 2px solid gray;
    }
  }
  & > view:not(:first-child) {
    margin-top: 70px;
  }

  &__synopsis-area {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    position: relative;
  }

  &__rate-area {
    display: flex;
    flex-direction: column;
    row-gap: 40px;
  }

  &__note-area {
    display: flex;
    flex-direction: column;
    row-gap: 30px;
  }
  &__control-area {
    margin-top: 40px;
    display: flex;
    column-gap: 30px;
  }
}

.icon__ebook {
  width: 45px;
  height: 45px;
}

.book-detail {
  &__cover {
    min-width: 200px;
    width: 200px;
    height: 300px;
    display: block;
    margin-right: 30px;
  }
  &__title {
    font-size: 50px;
    font-weight: 400;
  }
  &__author {
    font-size: 35px;
    margin-top: 10px;
    font-weight: 400;
    color: var(--main-color);
  }
  &__publisher {
    font-size: 35px;
    margin-top: 10px;
    font-weight: 400;
  }
}
.meta {
  &__book-type,
  &__book-pages {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    font-size: 35px;
    row-gap: 3px;
  }
}

.synopsis {
  &__more-icon {
    position: absolute;
    top: 20px;
    right: 40px;
    font-size: 30px;
  }
  &__popup {
    box-sizing: border-box;
    height: 80%;
    padding: 60px 45px;
  }
}
.heading {
  font-size: 45px;
}
.note {
  &__textarea {
    font-size: 40px;
  }
}
.button {
  width: 150px;
  height: 70px;
  font-size: 35px;
}
.disable-scroll {
  // 禁止被穿透的组件滚动 https://github.com/NervJS/taro/issues/5984#issuecomment-614502302
  overflow: hidden;
  height: 100vh;
}
</style>
