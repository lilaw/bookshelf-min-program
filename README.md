# bookshelf min program

## What is this?
 migrate vue project to wechat min program, built by Toro with vue

## Installation
 * backend
    
   后端使用微信云开发

   1. 在数据库中添加集合 `books`, `listItems`, `users`
   2. 把 `data/books-data.text` 导入 `books` 集合
   3. 上传 `cloud/functions` 中的云函数
 * frontend
   1. `cd client && yarn install`
   2. `yarn dev:weapp`
   > tip: 使用 WSL2 需要修改 `client/config/index.js` 中 `taro-plugin-sync-in-wsl` plugins 的复制路径。 不用WSL2则移除这个插件。 ~

## preview
<p align="center">
  <img src="https://github.com/lilaw/bookshelf-min-program/blob/main/data/preview.jpg?raw=true" alt="book details" style="width:400px;text-ali"/>
</p>