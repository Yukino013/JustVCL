<template>
  <!-- 下拉菜单组件的外部容器 -->
  <div class="vk-dropdown">
    <!-- Tooltip 组件，用于显示提示信息 -->
     <!-- 触发提示框显示的方式 -->
     <!-- 提示框相对于目标元素的位置 -->
     <!-- Popper.js 的选项 -->
     <!-- 提示框显示的延迟时间 -->
     <!-- 提示框隐藏的延迟时间 -->
     <!-- 是否手动控制提示框的显示和隐藏 -->
     <!-- 监听提示框显示状态变化的事件 -->
     <!-- 提示框组件的引用 -->
    <Tooltip 
      :trigger="trigger"           
      :placement="placement"        
      :popper-options="popperOptions" 
      :open-delay="openDelay"       
      :close-delay="closeDelay"     
      :manual="manual"              
      @visible-change="visibleChange" 
      ref="tooltipRef"              
    >
      <!-- 插槽，用于插入组件的内容 -->
      <slot />
      <!-- 命名插槽，用于定制下拉菜单的内容 -->
      <template #content>
        <!-- 下拉菜单的列表 -->
        <ul class="vk-dropdown__menu">
          <!-- 遍历菜单选项并渲染 -->
          <template v-for="item in menuOptions" :key="item.key">
            <!-- 如果是分隔符，则渲染一个分隔线 -->
            <li v-if="item.divided" role="separator" class="divided-placeholder" />
            <!-- 如果是菜单项，则渲染一个可点击的菜单项 -->
            <!-- 点击菜单项触发的事件 -->
            <!-- 动态类绑定 -->
            <!-- 动态绑定 id -->
            <li
              class="vk-dropdown__item"
              @click="itemClick(item)" 
              :class="{'is-disabled': item.disabled, 'is-divided': item.divided }" 
              :id="`dropdown-item-${item.key}`" 
            >
              <!-- 渲染虚拟节点 -->
              <RenderVnode :vNode="item.label"/>
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { DropdownProps, DropdownInstance, DropdownEmits, MenuOption } from './types'
import Tooltip from '../Tooltip/Tooltip.vue'
import RenderVnode from '../Common/RenderVnode'
import type { TooltipInstance } from '../Tooltip/types'

// 定义组件选项
defineOptions({
  name: 'VkDropdown'
})

// 定义组件属性并设置默认值
const props = withDefaults(defineProps<DropdownProps>(), { hideAfterClick: true })

// 定义组件事件
const emits = defineEmits<DropdownEmits>()

// 创建 Tooltip 组件实例的引用
const tooltipRef = ref<TooltipInstance | null>(null)

// 定义提示框显示状态变化的处理函数
const visibleChange = (e: boolean) => {
  emits('visible-change', e)
}

// 定义菜单项点击事件处理函数
const itemClick = (e: MenuOption) => {
  if (e.disabled) {
    return
  }
  emits('select', e) // 触发 select 事件
  if (props.hideAfterClick) {
    tooltipRef.value?.hide() // 点击菜单项后隐藏提示框
  }
}

// 暴露组件实例的方法
defineExpose<DropdownInstance>({
  show: () => tooltipRef.value?.show(), // 显示提示框
  hide: () => tooltipRef.value?.hide()  // 隐藏提示框
})
</script>
