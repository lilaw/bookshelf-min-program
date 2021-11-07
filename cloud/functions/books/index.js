const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();
const $ = db.command.aggregate;

exports.main = async (event, context) => {
  // find book by Id
  if (event.bookId) {
    const bookResult = await db.collection("books").doc(event.bookId).get();

    return {
      event,
      book: bookResult.data,
    };
  }

  // Search book
  if (event.bookName) {
    const searchResult = await db
      .collection("books")
      .limit(10)
      .where({
        title: db.RegExp({
          regexp: event.bookName,
          options: "i",
        }),
      })
      .get();
    var books = searchResult.data;
  } else {
    // return random recommended books
    const wxContext = cloud.getWXContext();
    let bookInListItemPromise = db
      .collection("users")
      .aggregate()
      .match({
        openId: wxContext.OPENID,
      })
      .lookup({
        from: "listItems",
        localField: "_id",
        foreignField: "ownerId",
        as: "bookList",
      })
      .end()
      .then((res) => res.list[0].bookList.map((item) => item.bookId));

    const recommendedBooksPromise = db
      .collection("books")
      .skip(event.pageNum * 10)
      .limit(10)
      .get();
      
    const bookInListItem = await bookInListItemPromise
    const recommendedBooks = await recommendedBooksPromise
    var books = recommendedBooks.data.filter(
      (item) => !bookInListItem.includes(item._id)
    );
  }

  return {
    event,
    books,
    dataInPage: event.pageNum + 1,
  };
};
