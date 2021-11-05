export default {
  pages: [
    "pages/index/index",
    "pages/readingList/readingList",
    "pages/details/details",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  tabBar: {
    selectedColor: "#59A5F0",
    backgroundColor: "#fff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        text: "图书推荐",
        iconPath: "images/tab1.png",
        selectedIconPath: "images/tabcolor1.png"
      },
      {
        pagePath: "pages/readingList/readingList",
        text: "我的书单",
        iconPath: "images/tab2.png",
        selectedIconPath: "images/tabcolor2.png"
      }
    ]
  }
};
