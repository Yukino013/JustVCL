/// <reference types="vitest" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros'

// https://vitejs.dev/config/
export default defineConfig({

  // plugins: 配置了 Vite 的插件列表，其中使用了 VueMacros.vite() 方法来添加 Vue 宏支持
  // 并且传入了一个对象，指定了 Vue 和 Vue JSX 插件
  plugins: [
    VueMacros.vite({
      plugins: {
        vue: vue(),
        vueJsx: vueJsx(),
      },
    })
  ],
  //配置了测试相关的选项，包括 globals 和 environment。
  //globals: true 表示测试代码可以访问全局变量，environment: 'jsdom' 表示测试环境使用 JSDOM。
  test: {
    globals: true,
    environment: 'jsdom'
  }
})


