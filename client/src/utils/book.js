import Taro from "@tarojs/taro";

// book :: string -> book  // a book object
export function book(bookId) {
  console.log("fetch book");
  return Taro.cloud
    .callFunction({
      name: "books",
      data: {
        bookId
      },
    })
    .then((res) => {
      console.log(res.result.books);
      return res.result.book
    })
    .catch((err) => {
      console.error(err);
    });
}


// bookSearch :: {string, number} -> [book]
export function bookSearch({query, pageNum}) {
  return Taro.cloud
    .callFunction({
      name: "books",
      data: {
        bookName: query,
        pageNum
      },
    })
    .then((res) => {
      return res.result
    })
    .catch((err) => {
      // handle error
      console.error(err);
    });
}