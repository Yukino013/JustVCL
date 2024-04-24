---
titie: Tooltip | V-element
description: Tooltip 组件的文档
---
# Tooltip 提示框
常用于展示鼠标 hover 时的提示信息。

## 基础用法
使用 `content` 属性来决定 hover 时的提示信息。

<preview path="../demo/Tooltip/Basic.vue" title="基础用法" description="Tooltip 组件的基础用法"></preview>

## 不同位置
由 placement 属性决定展示效果： placement属性值为：[方向]-[对齐位置]；四个方向：`top、left、right、bottom`；三种对齐位置：`start, end`，默认为空。


<preview path="../demo/Tooltip/Placement.vue" title="不同位置" description="由 placement 属性决定展示效果"></preview>


## 触发方式
由 trigger 属性决定触发方式： `hover | click`, 默认为 hover

<preview path="../demo/Tooltip/Trigger.vue" title="触发方式" description="由 trigger 属性决定触发方式"></preview>


## 更多内容的文字提示
展示多行文本或者是设置文本内容的格式

用具名 slot content，替代tooltip中的content属性。


<preview path="../demo/Tooltip/Slot.vue" title="更多内容的文字提示" description="展示多行文本或者是设置文本内容的格式"></preview>


## 手动触发
将 `manual` 属性设置为 true 即可， 然后可以使用实例上面的 `show` 和 `hide` 方法打开关闭下拉菜单。

<preview path="../demo/Tooltip/Manual.vue" title="更多内容的文字提示" description="展示多行文本或者是设置文本内容的格式"></preview>


## API

### 属性

|属性名|说明|类型|默认值|
|:----|:----|:----|:----|
|content|display content, can be overridden by `slot#content`|^[string]|''|
|placement|position of Tooltip|^[enum]`'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end' \| 'left' \| 'left-start' \| 'left-end' \| 'right' \| 'right-start' \| 'right-end'`|bottom|`
|popper-options|popper.js parameters|^[object]refer to popper.js doc|{}|
|open-delay|delay of appearance, in millisecond|^[number]|0|
|close-delay|delay of disappear, in millisecond|^[number]|200|
|trigger|How should the tooltip be triggered (to show)|^[enum]`'hover' \| 'click'`|hover|
|manual|是否开启手动触发模式|^[boolean]`|false|
|transition|transition name|^[string]|''|


### 事件
|事件名|说明|类型|
|:----|:----|:----|
|visible-change|当 tooltip 展示/隐藏时被触发|`boolean`|
|click-outside|当点击到 Tooltip 外侧区域时被触发|`boolean`|


### 插槽
|:----|
|插槽名|说明|
|default|Tooltip triggering & reference element|
|content|customize content|


### 暴露

|暴露名|说明|类型|
|:----|:----|:----|
|show|expose show function|^[Function]`(event?: Event \| undefined) => void`|
|hide|expose hide function|^[Function]`(event?: Event \| undefined) => void`|
