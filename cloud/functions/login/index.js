const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();

exports.main = async (event, context) => {
  console.log("login");
  const wxContext = cloud.getWXContext();
  let user = await db
    .collection("users")
    .where({
      openId: wxContext.OPENID,
    })
    .get();
  if (user.data.length === 1) {
    return {
      user: user.data[0],
    };
  }

  user = await db
    .collection("users")
    .add({
      data: {
        openId: wxContext.OPENID,
        username: "anonymous",
      },
    })
    .then(({ _id }) => {
      return db.collection("users").doc(_id).get();
    })
    .then((res) => res.data);

  return {
    user,
  };
};
