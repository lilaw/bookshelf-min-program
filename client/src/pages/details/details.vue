<script>
import { reactive, toRefs } from "vue";
import Taro from "@tarojs/taro";
export default {
  setup() {
    const db = Taro.cloud.database();
    const state = reactive({
      isImgPreviewing: false,
      imgPreviewItem: [],
      book: {},
      isLoading: true,
      error: {},
      value: 3,
      showSynopsis: true
    });

    loadBook();

    function loadBook() {
      db.collection("books")
        .where({
          title: "Voice of War"
        })
        .get()
        .then(function setBook(res) {
          state.book = res.data[0];
          state.isLoading = false;
          state.imgPreviewItem.push(state.book.coverImageUrl);
        })
        .catch(function setError(e) {
          state.error = e;
        });
    }
    const showImgPreview = () => {
      console.log("open img preview");
      state.isImgPreviewing = true;
      Taro.previewImage({
        current: state.imgPreviewItem[0], // 当前显示图片的http链接
        urls: state.imgPreviewItem // 需要预览的图片http链接列表
      });
    };

    function openSynopsis() {
      state.showSynopsis = true;
      console.log("tap");
    }

    function closeSynopsis() {
      console.log("closeSynopsis");
    }

    return {
      ...toRefs(state),
      showImgPreview,
      openSynopsis,
      closeSynopsis
    };
  }
};
</script>

<template>
  <view>
    <view v-if="isLoading">loading</view>
    <view class="details" v-else>
      <view class="details__head-area">
        <image
          :src="book.coverImageUrl"
          :alt="`${book.title} cover`"
          class="book__cover"
          @tap="showImgPreview"
        />
        <view class="details__title-and-author-area">
          <text class="book__title">{{ book.title }}</text>
          <text class="book__author">{{ book.author }}</text>
          <text class="book__publisher">{{ book.publisher }}</text>
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
      <view class="details__rate-area">
        <text class="rate__heading heading">Rate this book</text>
        <nut-rate
          :total="6"
          v-model="value"
          active-color="#59A5F0"
          spacing="50"
          class="rate_stars"
        />
      </view>
      <view class="details__note-area">
        <text class="note__heading heading">Note: </text>
        <nut-textarea
          v-model="value"
          rows="10"
          autosize
          class="note__textarea"
        />
      </view>

      <nut-popup
        position="bottom"
        closeable
        round
        pop-class="synopsis__popup"
        v-model:visible="showSynopsis"
        @close="closeSynopsis"
        ><text>{{ book.synopsis }}</text></nut-popup
      >
      <text>{{ JSON.stringify(book, null, 2) }}</text>
    </view>
  </view>
</template>

<style lang="scss">
.details {
  width: calc(750px - 60px);
  margin: 30px;

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
}

.icon__ebook {
  width: 45px;
  height: 45px;
}

.book {
  &__cover {
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
</style>
