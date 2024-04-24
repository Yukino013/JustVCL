## 一个只包含十余个组件的Vue组件库，后续更新中。。

### 安装


```bash
npm i @heibancha/element --save
```

### 开始使用

**全局使用**


```js
// 引入所有组件
import VElement from '@heibancha/element'
// 引入样式
import '@heibancha/element/dist/style.css'

import App from './App.vue'
// 全局使用
createApp(App).use(VElement).mount('#app')
```

```vue
<template>
  <vk-button>我是 VkButton</vk-button>
</template>
```

**单个导入**

提供了基于 ES Module 的开箱即用的 Tree Shaking 功能。


```vue
<template>
  <Button>我是按钮</Button>
</template>
<script>
  import { Button } from ' @heibancha/element'
  export default {
    components: { Button },
  }
</script>
```

