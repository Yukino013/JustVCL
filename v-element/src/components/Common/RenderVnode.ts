import { defineComponent } from 'vue'
const RenderVnode = defineComponent({
  props: {
    vNode: {
      //可以是字符串或对象，且是必需的
      type: [String, Object],
      required: true
    }
  },
  setup(props) {
    //这个渲染函数接收 props 对象作为参数，并返回 props.vNode，即接收到的虚拟节点
    return () => props.vNode
  }
})

//将 RenderVnode 组件导出
export default RenderVnode