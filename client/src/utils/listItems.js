import Taro from "@tarojs/taro";
import { useUser } from "./helper";

export async function listItems(user) {
  // const db = Taro.cloud.database();

  // const result = await db
  //   .collection("listItems")
  //   .where({ ownerId: user._id })
  //   .get()
  //   .then(res => ({ status: "ok", message: res.errMsg, data: res.data[0] }))
  //   .catch(() =>
  //     Promise.reject({ status: "error", message: "failed to fetch list items" })
  //   );
  // return result;
}

export async function listItem(user, bookId) {
  const db = Taro.cloud.database();

  const result = await db
    .collection("listItems")
    .where({ ownerId: user._id, bookId })
    .get()
    .then(res => ({ status: "ok", message: res.errMsg, data: res.data }))
    .catch(() =>
      Promise.reject({
        status: "error",
        message: `failed to fetch list items: bookId ${bookId}`
      })
    );
  return result;
}

export async function createListItem(user, bookId) {
  const db = Taro.cloud.database();

  const linkId = `${user._id}${bookId}`;
  const isThisBookInListItem = await db
    .collection("listItems")
    .where({ linkId })
    .get()
    .then(res => res.data.length >= 1);

  console.log("is Book in list item", isThisBookInListItem);
  if (isThisBookInListItem) {
    return Promise.reject({
      status: "error",
      message:
        "This user cannot create new list item for that book, this book has been added to list"
    });
  }

  const record = await db
    .collection("listItems")
    .add({
      data: {
        linkId,
        ownerId: user._id,
        bookId: bookId,
        rating: -1,
        notes: "",
        startDate: Date.now(),
        finishDate: null
      }
    })
    .then(checkResultAfterAddRecord)
    .then(() => listItem(user, bookId));

  return record;

  function checkResultAfterAddRecord(res) {
    if (res.errMsg === "collection.add:ok") {
      return res;
    } else {
      return Promise.reject({
        status: "error",
        message: `Can not add listItem to database,  message from server: ${res.errMsg}`
      });
    }
  }
}

export async function removeListItem(listItemId) {
  const db = Taro.cloud.database();
  return db
    .collection("listItems")
    .doc(listItemId)
    .remove()
    .then(res => ({
      status: "ok",
      message: res.errMsg
    }))
    .catch(e => Promise.reject({ status: "error", message: e.message }));
}

// listItemId finishDate rate note
export async function updateListItem(payload) {
  const db = Taro.cloud.database();
  // const payload = {
  //   listItemId: "9e7190f161823ec7037817d323b9984a",
  //   finishDate: Date.now(),
  //   rating: 2,
  //   note: "gread book"
  // };
  const omitListitemId = Object.fromEntries(
    Object.entries(payload).filter(([key]) => key !== "listItemId")
  );

  const result = await db
    .collection("listItems")
    .doc(payload.listItemId)
    .update({
      data: {
        ...omitListitemId
      }
    })
    .then(getById)
    .then(res => ({ status: "ok", message: res.errMsg, data: res.data }))
    .catch(() =>
      Promise.reject({
        status: "error",
        message: `failed to fetch list items: listItemId ${payload.listItemId}`
      })
    );

  return result;
  function getById() {
    return db
      .collection("listItems")
      .doc(payload.listItemId)
      .get();
  }
}
