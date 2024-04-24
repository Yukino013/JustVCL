<template>
<div
  class="vk-select"
  :class="{'is-disabled': disabled }"
  @click="toggleDropdown"
  @mouseenter="states.mouseHover = true"
  @mouseleave="states.mouseHover = false"
>
  <Tooltip
    placement="bottom-start"
    ref="tooltipRef"
    :popperOptions="popperOptions"
    @click-outside="controlDropdown(false)"
    manual
  >
    <Input 
      v-model="states.inputValue"
      :disabled="disabled"
      :placeholder="filteredPlaceholder"
      ref="inputRef"
      :readonly="!filterable || !isDropdownShow"
      @input="debouceOnFilter"
      @keydown="handleKeydown"
    >
      <template #suffix>
        <Icon 
          icon="circle-xmark"
          v-if="showClearIcon"
          class="vk-input__clear"
          @mousedown.prevent="NOOP"
          @click.stop="onClear"  
        />

        <Icon
          v-else
          icon="angle-down" 
          class="header-angle" 
          :class="{ 'is-active': isDropdownShow }"
        />
      </template>
    </Input>
    <template #content>
      <div class="vk-select__loading" v-if="states.loading"><Icon icon="spinner" spin/></div>
      <div class="vk-select__nodata" v-else-if="filterable && filteredOptions.length === 0">no matching data</div>
      <ul class="vk-select__menu" v-else>
        <template v-for="(item, index) in filteredOptions" :key="index">
          <li 
            class="vk-select__menu-item"
            :class="{
              'is-disabled': item.disabled, 
              'is-selected': states.selectedOption?.value === item.value ,
              'is-highlighted': states.highlightIndex === index
            }"
            :id="`select-item-${item.value}`"
            @click.stop="itemSelect(item)"
          >
            <RenderVnode :vNode="renderLabel ? renderLabel(item) : item.label"/>
          </li>
        </template>
      </ul>
    </template>
  </Tooltip>
</div>  
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { isFunction, debounce } from 'lodash-es'
import type { SelectProps, SelectEmits, SelectOption, SelectStates } from './types'
import Tooltip from '../Tooltip/Tooltip.vue'
import type { TooltipInstance } from '../Tooltip/types'
import Input from '../Input/Input.vue'
import Icon from '../Icon/Icon.vue'
import RenderVnode from '../Common/RenderVnode'
import type { InputInstance } from '../Input/types'

const findOption = (value: string) => {
  const option = props.options.find(option => option.value === value)
  return option ? option : null
}
defineOptions({
  name: 'VkSelect'
})
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => []
})
  const timeout = computed(() => props.remote ? 300 : 0)
const emits = defineEmits<SelectEmits>()
let initialOption: SelectOption | null = findOption(props.modelValue)
const tooltipRef = ref() as Ref<TooltipInstance>
const inputRef = ref() as Ref<InputInstance>
const states = reactive<SelectStates>({
  inputValue: initialOption ? initialOption.label : '',
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightIndex: -1
})
const isDropdownShow = ref(false)
const popperOptions: any = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9],
      },
    },
    {
      name: "sameWidth",
      enabled: true,
      fn: ({ state }: { state: any }) => {
          state.styles.popper.width = `${state.rects.reference.width}px`;
      },
      phase: "beforeWrite",
      requires: ["computeStyles"],
    }
  ],
}
const filteredOptions = ref(props.options)
watch(() => props.options, (newOptions) => {
  filteredOptions.value = newOptions
})

// 监听 modelValue 的变化，以更新选项


// 如果props中没有filterable属性，直接返回
const generateFilterOptions = async (searchValue: string) => {
  if (!props.filterable) return
  // 如果props中有filterMethod属性，并且是函数，则调用filterMethod方法
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(searchValue)
  // 如果props中有remote属性，并且是函数，则调用remoteMethod方法
  } else if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    //表示正在进行对应的加载
    states.loading = true
     //处理异步
    try {
      // 调用remoteMethod方法，并将结果赋值给filteredOptions.value
      filteredOptions.value = await props.remoteMethod(searchValue)
    } catch (e) {
      console.error(e)
     //清空，代表有问题
      filteredOptions.value = []
    } finally {
      //加载属性消失
      states.loading = false
    }
  // 否则，调用options的filter方法，将searchValue包含在label中的option过滤出来
  } else {
    filteredOptions.value = props.options.filter(option => option.label.includes(searchValue))
  }
  states.highlightIndex = -1

}
const onFilter = () => {
  generateFilterOptions(states.inputValue)
}
const debouceOnFilter = debounce(() => {
  onFilter()
}, timeout.value)



const filteredPlaceholder = computed(() => {
  return (props.filterable && states.selectedOption && isDropdownShow.value) 
  ? states.selectedOption.label : props.placeholder
})


const controlDropdown = (show: boolean) => {
  if (show) {
    // filter 模式优化
    // 之前选择过对应的值
    if (props.filterable && states.selectedOption) {
      states.inputValue = ''
    }
    // blur 时候 进行一次默认选项的生成 
    if (props.filterable) {
      generateFilterOptions(states.inputValue)
    }
    tooltipRef.value.show()
  } else {
    tooltipRef.value.hide()
    // blur 时候 将之前的值回灌到 input 中 （显示要求）
    if (props.filterable) {
      states.inputValue = states.selectedOption ? states.selectedOption.label : ''
    }
    states.highlightIndex = -1
  }
  isDropdownShow.value = show
  emits('visible-change', show)
}
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Enter':
      if (!isDropdownShow.value) {
        //打开菜单
        controlDropdown(true)
      } else {
        //高光移动到非默认值并且值存在
        if (states.highlightIndex > -1 && filteredOptions.value[states.highlightIndex]) {
          itemSelect(filteredOptions.value[states.highlightIndex])
        } else {
          //关闭菜单
          controlDropdown(false)
        }
      }
      break
    case 'Escape':
      if (isDropdownShow.value) {
        controlDropdown(false)
      }
      break
    case 'ArrowUp':
      e.preventDefault()
      //初始值states.highlightIndex = -1
      //判断菜单有值
      if (filteredOptions.value.length > 0) {
        //高亮到最后一项 和 循环操作对应states.highlightIndex===0
        if (states.highlightIndex === -1 || states.highlightIndex === 0) {
          states.highlightIndex = filteredOptions.value.length - 1
        } else {
          // 向上移动
          states.highlightIndex--
        }
      }
      break
    case 'ArrowDown':
      //阻止默认行为 页面的滚动条移动
      e.preventDefault()
      // states.highlightIndex = -1
      //判断菜单有值
      if (filteredOptions.value.length > 0) {
          //高亮到最后一项 和 循环操作对应states.highlightIndex===0
        if (states.highlightIndex === -1 || states.highlightIndex === (filteredOptions.value.length - 1)) {
          states.highlightIndex = 0
        } else {
          // 向下移动
          states.highlightIndex++
        }
      }
      break
    default:
      break;
  }
}
const showClearIcon = computed(() => {
  // * hover 上去
  // * props.clearable 为 true
  // 必须要有选择过选项
  // Input 的值不能为空
  return props.clearable 
    && states.mouseHover
    && states.selectedOption
    && states.inputValue.trim() !== ''
})
const onClear = () => {
  states.selectedOption = null
  states.inputValue = ''
  emits('clear')
  emits('change', '')
  emits('update:modelValue', '')
}
const NOOP = () => {}
const toggleDropdown = () => {
  if (props.disabled) return
  if (isDropdownShow.value) {
    controlDropdown(false)
  } else {
    controlDropdown(true)
  }
}
const itemSelect = (e: SelectOption) => {
  if (e.disabled) return
  states.inputValue = e.label
  states.selectedOption = e
  emits('change', e.value)
  emits('update:modelValue', e.value)
  controlDropdown(false)
  inputRef.value.ref.focus()
}
</script>