import Taro from "@tarojs/taro";

// book :: string -> book  // a book object
export function login() {
  console.log("login");
  return Taro.cloud
    .callFunction({
      name: "login"
    })
    .then(res => {
      return {
        status: "ok",
        message: `${res.errMsg}`,
        data: res.result.user
      };
    })
    .catch(err => {
      return Promise.reject({
        status: "error",
        message: `cant not login, ${err.errMsg}`
      });
    });
}
