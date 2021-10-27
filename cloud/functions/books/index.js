const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();
const dbCommand = db.command;

exports.main = async (event, context) => {
  var books;
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
    books = searchResult.data;
  } else {
    // return random recommended books
    const recommendedBooks = await db.collection("books").limit(10).get();
    books = recommendedBooks.data;
  }

  return {
    event,
    books,
  };
};
