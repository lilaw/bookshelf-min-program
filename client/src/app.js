import store from "./store/index";
import { createApp } from "vue";
import {
  Button,
  Input,
  Icon,
  Rate,
  Layout,
  Row,
  Col,
  TextArea,
  ImagePreview ,
  Popup,
  Notify,
  Tabs, TabPane 
} from "@nutui/nutui-taro";
import "@nutui/nutui-taro/dist/style.css";
import "./app.scss";
import Taro from "@tarojs/taro";

const App = createApp({
  onShow(options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
  beforeCreate() {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init();
    }
  },
  mounted() {
    store.dispatch('login/login').then(() => console.log("logined"))
  }
});

App.use(store)
  .use(Rate)
  .use(Input)
  .use(Icon)
  .use(Button)
  .use(Layout)
  .use(Row)
  .use(Col)
  .use(TextArea)
  .use(ImagePreview)
  .use(Popup)
  .use(Notify)
  .use(Tabs)
  .use(TabPane)

export default App;
