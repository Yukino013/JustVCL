<template>
<div
  class="vk-collapse-item"
  :class="{
    'is-disabled': disabled
  }">
  <div 
    class="vk-collapse-item__header"
    :class="{
      'is-disabled': disabled,
      'is-active': isActive
    }"
    :id="`item-header-${name}`" 
    @click="handleClick"
  >
  <!-- 这里使用具名插槽 -->
    <slot name="title">{{title}}</slot>
    <Icon icon="angle-right" class="header-angle" />
  </div>
  <Transition name="slide" v-on="transitionEvents">
    <div class="vk-collapse-item__wrapper" v-show="isActive">
      <div class="vk-collapse-item__content" :id="`item-content-${name}`">
        <slot/>
      </div>
    </div>
  </Transition>
</div>
</template>
<script setup lang="ts">
import { inject, computed } from 'vue'
import type { CollapseItemProps } from './types'
import { collapseContextKey } from './types'
import Icon from '../Icon/Icon.vue'
defineOptions({
  name: 'VkCollapseItem'
})
//收到props中的参数
const props = defineProps<CollapseItemProps>()
//获取父组件传递的collapseContext上下文对象
const collapseContext = inject(collapseContextKey)
//判断当前item是否处于激活状态
const isActive = computed(() => collapseContext?.activeNames.value.includes(props.name))
//当点击事件发生时，检查是否禁用了点击，如果未禁用，则将props收到的对象中的属性值作为参数传递给这个调用上下文对象中的handleItemClick函数
const handleClick = () => {
  if (props.disabled) { return }
  collapseContext?.handleItemClick(props.name)
}
// 这些都是js钩子与过渡transition相关 过渡效果相关的事件处理函数 包含一些函数的对象 ，用record --ts提高代码的可读性和可维护性
const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  beforeEnter(el) {
    el.style.height = '0px'
    el.style.overflow = 'hidden'
  },
  enter(el) {
    el.style.height = `${el.scrollHeight}px`
  },
  afterEnter(el) {
    el.style.height = ''
    el.style.overflow = ''
  },
  beforeLeave(el) { 
    el.style.height = `${el.scrollHeight}px`
    el.style.overflow = 'hidden'
  },
  leave(el) {
    el.style.height = '0px'
  },
  afterLeave(el) {
    el.style.height = ''
    el.style.overflow = ''
  }

}
</script>