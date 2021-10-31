import store from "./store";
import { createApp } from "vue";
import {
  Button,
  Toast,
  Input,
  Icon,
  Rate,
  Layout,
  Row,
  Col,
  TextArea,
  ImagePreview ,
  Popup
} from "@nutui/nutui-taro";
import "@nutui/nutui-taro/dist/style.css";
import "./app.scss";

import Taro from "@tarojs/taro";

const App = createApp({
  onShow(options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
  mounted() {
    if (process.env.TARO_ENV === "weapp") {
      Taro.cloud.init();
    }
  }
});

App.use(store)
  .use(Rate)
  .use(Toast)
  .use(Input)
  .use(Icon)
  .use(Button)
  .use(Layout)
  .use(Row)
  .use(Col)
  .use(TextArea)
  .use(ImagePreview)
  .use(Popup)

export default App;
