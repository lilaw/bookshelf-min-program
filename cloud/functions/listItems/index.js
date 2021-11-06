const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();
const $ = db.command.aggregate;

exports.main = async (event, context) => {
  const data = await db
    .collection("listItems")
    .aggregate()
    .match({
      ownerId: event.userId,
    })
    .lookup({
      from: "books",
      localField: "bookId",
      foreignField: "_id",
      as: "book",
    })
    .project({
      book: $.arrayElemAt(['$book', 0]),
      bookId: 1,
      finishDate: 1,
      linkId: 1,
      note: 1,
      ownerId: 1,
      rating: 1,
      startDate: 1,
    })
    .end();

  return {
    event,
    data,
  };
};
