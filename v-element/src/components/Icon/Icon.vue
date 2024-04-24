<template>
  <i class="vk-icon" :class="{[`vk-icon--${type}`] : type }" :style="customStyles" v-bind="$attrs">
    <font-awesome-icon v-bind="filteredProps"/>
  </i>
</template>
<script setup lang="ts">
import { computed } from 'vue'
//从lodash-es导入omit用作过滤器
import { omit } from 'lodash-es'
//导入IconProps类型
import type { IconProps } from './types'
//导入基于vue3的包装
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
defineOptions({
  name: 'VkIcon',
  // 禁用默认的attribute继承 禁用透传
  // 因为FontAwesomeIcon组件需要接收props
  // 并且我们不希望将props传递给<i>元素
  // 因此，我们禁用默认的attribute继承
  // 然后手动传递props
  // 这样，我们就可以将props传递给FontAwesomeIcon组件
  inheritAttrs: false
})
const props = defineProps<IconProps>()
//用omit函数来过滤属性是为了确保在传递给FontAwesomeIcon组件之前
//从props中删除了一些不必要的属性
//通过过滤这些属性，我们确保FontAwesomeIcon组件仅接收其需要的属性
//而不会受到额外属性的干扰或错误传递
//computed的目的是为了创建一个响应式的计算属性
//该计算属性会根据props对象的变化而重新计算其值
//在Vue中，当我们直接使用props对象时，它是只读的，我们不能直接对其进行修改
//但是，有时我们可能需要根据props的值来生成一些新的数据
//这些数据可能依赖于props的内容，
//并且当props发生变化时，这些数据也需要相应地更新。
const filteredProps = computed(() => omit(props, ['type', 'color']))
//customStyles是一个计算属性，它会根据props对象中的color属性的值来动态生成一个行内样式对象。
//如果props.color存在（即props.color不是undefined或null），那么行内样式对象将会包含一个color属性，其值为props.color的值；
//否则，行内样式对象将为空对象。
//行内样式inline style优先级最高
//这个计算属性的作用是根据传入的color属性来生成一个适用于Vue模板中的行内样式对象。
//当color属性的值发生变化时，customStyles会自动更新，以保持响应式。
const customStyles = computed(() => {
  return props.color ? { color: props.color } : {}
})
</script>

