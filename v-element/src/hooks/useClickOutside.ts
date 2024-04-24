import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

// 自定义钩子函数useClickOutside，用于在 Vue 组件中监听点击事件
// 以便判断点击是否在指定的元素外部，并执行相应的回调函数

//elementRef，一个引用（Ref），用于引用需要监听点击事件的元素,这里是Dom容器
//callback接受一个 MouseEvent 参数，表示被点击的事件对象
const useClickOutside = (elementRef: Ref<undefined | HTMLElement>, callback: (e: MouseEvent) => void) => {
  //定义了一个 handler 函数，用于处理点击事件
  const handler = (e: MouseEvent) => {
    //检查点击的目标是否在指定的元素外部，如果是，则调用传入的回调函数
    if (elementRef.value && e.target) {
      //TypeScript 中并不会默认将 e.target 识别为 HTMLElement 类型，因为它可能是任意的 DOM 元素或者是 null
      //因此，我们需要使用类型断言将其显式地转换为 HTMLElement 类型
      if (!elementRef.value.contains(e.target as HTMLElement)) {
        //callback() 被用于隐藏提示框。当点击事件发生，且点击位置不在提示框内时，就会调用 callback()
        //这样就能够隐藏提示框，达到关闭的效果。
        callback(e)
      }
    }
  }
  //使用onMounted 钩子函数，在组件挂载后执行，向 document 添加了一个点击事件监听器，这样当点击事件发生时，就会触发 handler 函数
  onMounted(() => {
    document.addEventListener('click', handler)
  })
  //使用 onUnmounted 钩子函数，在组件卸载前执行，移除了之前添加的点击事件监听器，以防止内存泄漏和性能问题
  onUnmounted(() => {
    document.removeEventListener('click', handler)
  })
}
// 导出了 useClickOutside 函数，使其可以在其他地方被引用和使用。
export default useClickOutside