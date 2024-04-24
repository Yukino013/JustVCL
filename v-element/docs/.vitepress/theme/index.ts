//导入，不修改对应的主题
import DefaultTheme from 'vitepress/theme'
//导入图标文件
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

import { ElementPlusContainer } from '@vitepress-demo-preview/component'

import '@vitepress-demo-preview/component/dist/style.css'
import '../../../src/styles/index.css'
import './custom.css'

library.add(fas)

//导出
export default {
  ...DefaultTheme,
  // 注册一个全局组件
  enhanceApp({ app }) {
    app.component('demo-preview', ElementPlusContainer)
  }  
}