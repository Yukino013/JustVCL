import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros'
//导入对应的插件
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Simple Components Project",
  description: "A VitePress Site",
  vite: {
    plugins: [
      VueMacros.vite({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vueJsx: vueJsx(),
        },
      }),
    ],
    resolve: {
      alias: {
        // 路径配置
        '@': fileURLToPath(new URL('../../src', import.meta.url))
      }
    }
  },
  // 配置对应的插件
  markdown: {
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    //上方的导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'Test', link: '/markdown-examples' }
    ],
    //对应的左侧边栏
    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
          { text: 'Test here', link: '/api-examples' }
        ]
      },
      {
        text: 'Basic',
        items: [
          {text: 'Button', link: '/components/button' },
          {text: 'Collapse', link: '/components/collapse' },
          {text: 'Tooltip', link: '/components/tooltip' },
          {text: 'Drowdown', link: '/components/dropdown' },
          {text: 'Message', link: '/components/message' },
          {text: 'Input', link: '/components/input' },
          {text: 'Select', link: '/components/select'},
          {text: 'Switch', link: '/components/switch'},
          {text: 'Form', link: '/components/form'},
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
