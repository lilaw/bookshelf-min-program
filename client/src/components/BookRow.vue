<template>
  <view class="book" data-testid="book-row">
    <!-- <el-skeleton v-if="isLoading" aria-label="loading">
      <template #template>
        <div class="book__wrapper">
          <el-skeleton-item
            variant="image"
            class="book__cover"
            style="height: 210px"
          />
          <el-skeleton :rows="5" animated />
        </div>
      </template>
    </el-skeleton> -->
    <navigator class="book__link">
      <view class="book__wrapper">
        <image
          lazy-load="true"
          :src="book.coverImageUrl"
          :alt="`${book.title} cover`"
          :class="{ book__cover: true, 'book__cover--small': isSmallSize }"
        />
        <view class="book__info">
          <view>
            <text class="book__title">{{ book.title }}</text>
            <text class="book__author">{{ book.author }}</text>
          </view>
          <text
            :class="{
              book__synopsis: true,
              'book__synopsis--small': isSmallSize}"
            >{{ book.synopsis.substring(0, 200) }}...</text
          >
        </view>
      </view>
    </navigator>
    <!-- <TooltipStatus :buttonsRef="buttons" :bookState="bookState" /> -->
  </view>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    book: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: "normal",
      validator(value) {
        return ["normal", "small"].includes(value);
      }
    }
  },
  setup(props) {
    // const { state: bookState } = useActor(props.bookRef);
    // const book = computed(() => bookState.value.context?.book);
    // const buttons = computed(() => bookState.value.context?.buttons);
    // const isLoading = computed(() => bookState.value.matches("loadBook"));
    const isSmallSize = computed(() => props.size === "small");

    return {
      isSmallSize
    };
    // return { book, bookState, buttons, isLoading };
  },
  components: {
    // TooltipStatus,
  }
};
</script>

// css varable not work. https://github.com/NervJS/taro/issues/10008
<style lang="scss">
.book {
  position: relative;
  margin-bottom: 50px;
  width: 725px;
  display: flex;
  &__wrapper {
    /* column-gap: 20rpx; */
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    border: white solid 0.1em;
    background-color: white;
  }
  &__cover {
    float: left;
    width: 200px;
    height: 300px;
    display: block;
    padding-right: 20px;

    &--small {
      width: 120px;
      height: 180px;
    }
  }
  &__info {
  }
  &__title {
    font-size: 40px;
    font-weight: 600;
    display: block;
  }
  &__author {
    padding-top: 10px;
    font-style: italic;
    display: block;
    margin-bottom: 30px;
  }
  &__synopsis {
    text-align: left;
    &--small {
      display: none;
    }
  }
  &__link {
    width: 100%;
  }
}
</style>
