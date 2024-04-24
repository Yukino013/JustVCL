<template>
<div
  class="vk-switch"
  :class="{
    [`vk-switch--${size}`]: size,
    'is-disabled': disabled,
    'is-checked': checked
  }"
  @click="switchValue"
>
  <!-- 创建一个input元素，用于实现开关功能 -->
  <input 
    class="vk-swtich__input"
    type="checkbox"
    role="switch"
    ref="input"
    :name="name"
    :disabled="disabled"
    @keydown.enter="switchValue"
  />
  <!-- 开关核心部分 -->
  <div class="vk-switch__core">
    <!-- 开关核心内部部分 -->
    <div class="vk-switch__core-inner">
      <!-- 如果activeText或inactiveText存在，则显示对应的开关文字 -->
      <span v-if="activeText || inactiveText" class="vk-switch__core-inner-text">
        {{checked ? activeText : inactiveText}}
      </span>
    </div>
    <!-- 开关核心操作部分 -->
    <div class="vk-switch__core-action">
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { SwtichProps, SwtichEmits } from './types'

// 定义组件名称
defineOptions({
  name: 'VkSwtich',
  // 不继承父组件属性
  inheritAttrs: false
})
// 定义组件属性，并设置默认值
const props = withDefaults(defineProps<SwtichProps>(), {
  activeValue: true,
  inactiveValue: false
})
// 定义组件事件
const emits = defineEmits<SwtichEmits>()

const innerValue = ref(props.modelValue)
const input = ref<HTMLInputElement>()
// 现在是否被选中
// 计算属性，判断innerValue是否等于props.activeValue
const checked = computed(() => innerValue.value === props.activeValue)
// 定义一个函数，用于切换值
const switchValue = () => {
  // 如果props.disabled为true，则直接返回
  if (props.disabled) return
  // 获取新的值
  const newValue = checked.value ? props.inactiveValue : props.activeValue
  // 将新的值赋值给innerValue
  innerValue.value = newValue
  // 触发update:modelValue事件，传递新的值
  emits('update:modelValue', newValue)
  // 触发change事件，传递新的值
  emits('change', newValue)
}

// 监听props.modelValue的变化，更新innerValue的值
watch(() => props.modelValue, (val) => {
  innerValue.value = val
})

// 监听innerValue的变化，更新input的checked属性
watch(() => innerValue.value, (val) => {
  if (input.value) {
    input.value.checked = checked.value
  }
})

onMounted(() => {
  if (input.value) {
    input.value.checked = checked.value
  }
})
// 当组件挂载时，将checked的值赋值给input
onMounted(() => {
  input.value!.checked = checked.value
})
// 当checked的值发生变化时，将新的值赋值给input
watch(checked, (val) => {
  input.value!.checked = val
})
// 当props.modelValue的值发生变化时，将新的值赋值给innerValue
watch(() => props.modelValue, (newValue) => {
  innerValue.value = newValue
})
</script>