<template>
<!-- 这里用模板字符串来实现type和size的动态绑定:class -->
<!-- disabled是原生属性，所以不需要:class来操作 -->
  <button
    ref="_ref"
    class="vk-button"
    :class="{
      [`vk-button--${type}`]: type,
      [`vk-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading
    }"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <Icon icon="spinner" spin v-if="loading" />
    <Icon :icon="icon" v-if="icon" />
    <span>
      <slot />
    </span>
  </button>
</template>


<script setup lang="ts">
import { ref,defineOptions,withDefaults } from 'vue'
import type { ButtonProps } from './types'
import Icon from '../Icon/Icon.vue'

defineOptions({
  name: 'VkButton'
})
//将props的类型移入一个单独的接口<ButtonProps>中,withDefaults为 props 声明默认值
withDefaults(defineProps<ButtonProps>(), {
  nativeType: 'button'
})

const _ref = ref<HTMLButtonElement>()

//通过 defineExpose来显式指定在组件中要暴露出去的属性
defineExpose({
  ref: _ref
})
</script>



<style scoped>

</style>
