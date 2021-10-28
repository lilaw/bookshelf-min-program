import store from './store'
import { createApp } from 'vue'
import { Button, Toast } from '@nutui/nutui-taro';
import '@nutui/nutui-taro/dist/style.css';
import './app.scss'

import Taro from '@tarojs/taro'

const App = createApp({
  onShow (options) {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
  mounted () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  },
})

App.use(store).use(Button).use(Toast)


export default App
