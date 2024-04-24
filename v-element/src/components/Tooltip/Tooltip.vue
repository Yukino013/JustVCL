<template>
  <!-- 将外部事件outerEvents绑定到这个div上 -->
<div
  class="vk-tooltip"
  ref="popperContainerNode"
  v-on="outerEvents"
>
<!-- 触发节点 -->
  <div
    class="vk-tooltip__trigger"
    ref="triggerNode"
    v-on="events"
  >
    <slot />
  </div>


  <Transition :name="transition">
    <!-- 展示节点 -->
    <div
      v-if="isOpen"
      class="vk-tooltip__popper"
      ref="popperNode"
    >
      <slot name="content">
        <!-- content将会被替换为父组件传递给插槽的内容 -->
        {{content}}
      </slot>
      <div id="arrow" data-popper-arrow></div>
    </div>
  </Transition>


</div>
</template>
<script setup lang="ts">
// 导入需要的函数和类型
import { ref, watch, reactive, onUnmounted, computed } from 'vue'
// 导入popper库
import { createPopper } from '@popperjs/core'
// 导入popper的类型定义
import type { Instance } from '@popperjs/core'
// 导入lodash的防抖函数
import { debounce } from 'lodash-es'
// 导入类型定义
import type { TooltipProps, TooltipEmits, TooltipInstance } from './types'
// 导入自定义的hook函数 useClickOutside
import useClickOutside from '../../hooks/useClickOutside'
// 定义组件的属性类型
defineOptions({
  name: 'VkTooltip'
})

//定义了一个用于存储 Tooltip 组件属性的对象 props
//设置了默认属性值
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: 'bottom',
  trigger: 'hover',
  transition: 'fade',
  openDelay: 0,
  closeDelay: 0,
})
//emits用于定义组件可以发射的事件类型，并返回一个函数
//该函数可以用来发射这些事件
const emits = defineEmits<TooltipEmits>()
//用于存储弹出框是否打开的响应式对象
const isOpen = ref(false)
//用于存储弹出框元素的引用的响应式对象
const popperNode = ref<HTMLElement>()
//用于存储触发器元素的引用的响应式对象
const triggerNode = ref<HTMLElement>()
//用于存储弹出框容器元素的引用的响应式对象
const popperContainerNode = ref<HTMLElement>()

//用于存储 popper 实例
let popperInstance: null | Instance = null
//这两个变量用于存储事件处理函数
let events: Record<string, any> = reactive({})
let outerEvents: Record<string, any> = reactive({})
//这两个变量用于跟踪 popper 实例的打开和关闭次数
let openTimes = 0
let closeTimes = 0


//一个计算属性，用于动态计算 popper 实例的选项
//它根据组件的 props（如 placement 和 popperOptions）动态生成 popper 的配置对象
const popperOptions = computed(() => {
  return {
    //placement 表示 popper 的放置位置
    placement: props.placement,
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 9],
        },
      }
    ],
    //这样确保 popper 实例的选项包含用户传入的自定义配置，同时保留了默认的配置
    ...props.popperOptions
  }
})

//调用打开操作时，openTimes 计数增加，并且打印当前打开次数到控制台。
//然后设置 isOpen 的值为 true，并通过 emits 函数发射 visible-change 事件
const open = () => {
  openTimes++
  console.log('open times', openTimes)
  isOpen.value = true
  emits('visible-change', true)

}
//调用关闭操作时，closeTimes 计数增加，并且打印当前关闭次数到控制台。
//然后设置 isOpen 的值为 false，并通过 emits 函数发射 visible-change 事件，
const close = () => {
  closeTimes++
  console.log('close times', closeTimes)
  isOpen.value = false
  emits('visible-change', false)
}
//这两个函数使用 debounce 函数包装了 open() 和 close() 函数，从而实现了防抖的效果。
//防抖是一种延迟执行的技术，用于限制某个函数在短时间内被多次调用，以减少不必要的执行次数
const openDebounce = debounce(open, props.openDelay)
const closeDebounce = debounce(close, props.closeDelay)


//两个函数分别取消之前的防抖操作，并重新执行对应的打开或关闭操作。
//它们被用于在需要立即执行打开或关闭操作时取消之前的延迟，确保立即生效
const openFinal = () => {
  closeDebounce.cancel()
  openDebounce()
}
const closeFinal = () => {
  openDebounce.cancel()
  closeDebounce()
}

//如果当前状态是打开的，则调用 closeFinal() 关闭弹出框；
//如果当前状态是关闭的，则调用 openFinal() 打开弹出框
const togglePopper = () => {
  if (isOpen.value) {
    closeFinal()
  } else {
    openFinal()
  }
}

//在 useClickOutside 自定义钩子函数中被用来监听外部点击事件，以便在点击了提示框外部时关闭提示框
useClickOutside(popperContainerNode, () => {
  //如果触发方式是click，并且提示框是打开状态，并且不是手动模式，则关闭提示框
  if (props.trigger === 'click' && isOpen.value && !props.manual) {
    closeFinal()
  }
  //否则，触发点击外部事件
  if (isOpen.value) {
    emits('click-outside', true)
  }
})

//根据 props.trigger 的值来决定绑定哪些事件
//如果 props.trigger 是 'hover'，则将 mouseenter 事件绑定到 openFinal 函数，将 mouseleave 事件绑定到 closeFinal 函数。
//如果 props.trigger 是 'click'，则将 click 事件绑定到 togglePopper 函数。
const attachEvents = () => {
  if (props.trigger === 'hover') {
    events['mouseenter'] = openFinal
    outerEvents['mouseleave'] = closeFinal
  } else if (props.trigger === 'click') {
    events['click'] = togglePopper
  }
}
//如果 props.manual 的值为 false（即非手动模式），则调用 attachEvents() 函数绑定事件监听器。
if (!props.manual) {
  attachEvents()
}

//使用 watch 监听 props.manual 的变化。当 props.manual 发生变化时，根据新的值决定是否需要重新绑定事件监听器。
//如果 props.manual 变为 true，则清空 events 和 outerEvents 对象，即取消绑定所有事件；
//如果 props.manual 变为 false，则重新调用 attachEvents() 函数绑定事件监听器。
watch(() => props.manual, (isManual) => {
  if (isManual) {
    events = {}
    outerEvents = {}    
  } else {
    attachEvents()
  }
})

//使用 watch 监听 props.trigger 的变化。当 props.trigger 发生变化时，根据新的值决定是否需要重新绑定事件监听器。
//如果 props.trigger 变化了，说明事件类型也可能发生了变化，因此需要清空 events 和 outerEvents 对象，并重新调用 attachEvents() 函数绑定新的事件监听器。
watch(() => props.trigger, (newTrigger, oldTrigger) => {
  if (newTrigger !== oldTrigger) {
    events = {}
    outerEvents = {}
    attachEvents()
  }
})

//设置 flush: 'post' 将会使侦听器延迟到组件渲染之后再执行
//watch 函数用于监听 isOpen 变量的变化
//当 isOpen 的值发生变化时，如果新的值为 true
//检查 triggerNode 和 popperNode 的值是否存在。
//如果两者都存在，则调用 createPopper 函数创建一个新的 Popper 实例，用于控制弹出框的位置和行为。
//如果任一值不存在，说明无法创建 Popper 实例，此时应该销毁之前可能存在的 Popper 实例，以确保不会产生冗余或错误的 Popper 实例。
watch(isOpen, (newValue) => {
  if (newValue) {
    if (triggerNode.value && popperNode.value) {
      popperInstance = createPopper(triggerNode.value, popperNode.value, popperOptions.value)
    } else {
      popperInstance?.destroy()
    }
  }
  //通过设置 flush: 'post'，指定了监听函数会在组件更新后执行。这意味着在 Vue 组件更新之后，才会执行这个监听函数。
  //这样做的目的是确保监听函数中的逻辑能够在组件更新后的新状态下执行，从而避免在更新过程中产生不一致的状态
}, { flush: 'post'})


//当组件被卸载时，通过调用 popperInstance?.destroy() 方法销毁 Popper 实例，以防止内存泄漏或其它问题
onUnmounted(() => {
  popperInstance?.destroy()
})
//用于向父组件公开组件的内部方法或属性。在这里，通过调用 defineExpose 将两个内部方法 openFinal 和 closeFinal 暴露给了父组件
defineExpose<TooltipInstance>({
  'show': openFinal,
  'hide': closeFinal
})
</script>