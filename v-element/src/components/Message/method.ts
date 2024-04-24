import { render, h, shallowReactive } from 'vue'
import type { CreateMessageProps, MessageContext } from './types'
//导入Message组件的别名
import MessageConstructor from './Message.vue'
import useZIndex from '../../hooks/useZIndex'
//初始id为1
let seed = 1
//初始为空Messaage数组
const instances: MessageContext[] = shallowReactive([])
//创建Message组件函数
export const createMessage = (props: CreateMessageProps) => {
  const { nextZIndex } = useZIndex()
  //id + 1 操作，用来表示不同的message
  const id = `message_${seed++}`
  //创建dom节点
  const container = document.createElement('div')

  //清除节点
  const destory = () => {
    //删除数组中的instance实例
    //通过id找对应的instance实例
    const idx = instances.findIndex(instance => instance.id === id)
    //没找到就返回
    if (idx === -1) return
    //找到就删除
    instances.splice(idx, 1)
    //渲染null 到 dom 容器节点上 
    render(null, container)
  }
  //手动调用删除，其实就是手动的调整组件中 visible 的值
  //visible 是通过 expose 传出来的
  const manualDestroy = () => {
    //找instance
    const instance = instances.find(instance => instance.id === id)
    if (instance) {
      instance.vm.exposed!.visible.value = false
    }
  }
  //在原先传来的属性上扩展新的属性
  const newProps = {
    ...props,
    id,
    zIndex: nextZIndex(),
    onDestory: destory
  }
  //`h()` 函数用于创建 vnodes
  const vnode = h(MessageConstructor, newProps)
  //渲染vnode 到 dom 节点上
  render(vnode, container)
  //非空断言操作符 appendChild只能element，但这个类型可能为null，所以使用非空断言
  document.body.appendChild(container.firstElementChild!)
  //获取到内部实例并插入到数组中
  const vm = vnode.component!
  const instance = {
    id,
    vnode,
    vm,
    props: newProps,
    destory: manualDestroy
  }
  //插入到数组中
  instances.push(instance)
  return instance
}
//拿到最后一项instance实例
export const getLastInstance = () => {
  return instances.at(-1)
}

//获取上一个组件的BottomOffset
export const getLastBottomOffset = (id: string) => {
  //查找id
  const idx = instances.findIndex(instance => instance.id === id)
  console.log('idx', id, idx, instances.length)
  //没有返回
  if (idx <= 0) {
    return 0
  } else {
    //找到就返回bottomOffset.value的值
    const prev = instances[idx - 1]
    return prev.vm.exposed!.bottomOffset.value
  }
}

export const closeAll = () => {
  instances.forEach(instance => {
    instance.destory()
  })
}