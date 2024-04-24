---
titie: Collapse | V-element
description: Collapse 组件的文档
---

# Collapse 折叠面板
通过折叠面板收纳内容区域
## 基础用法

可同时展开多个面板,面板之间不影响

<preview path="../demo/Collapse/Basic.vue" title="基础用法" description="Collapse 组件的基础用法"></preview>


## 手风琴效果
每次只能展开一个面板,通过 `accordion` 属性来设置是否以手风琴模式显示。
<preview path="../demo/Collapse/Accordion.vue" title="手风琴效果" description="每次只能展开一个面板"></preview>


## Collapse API

### Collapse 属性
|属性名|说明|类型|接收值|默认值|
|:----|:----|:----|:----|:----|
|model-value / v-model|当前激活的面板|string (accordion mode) / array (non-accordion mode)|—|—|
|accordion|是否开启手风琴模式|boolean|—|false|

### Collapse 事件
|事件名|说明|Parameters|
|:----|:----|:----|
|change|切换当前活动面板，在手风琴模式下其类型是string，在其他模式下是array|

### Collapse 插槽
|插槽名|说明|Subtags|
|:----|:----|:----|
|-|自定义默认内容|Collapse Item|

## Collapse Item API

### Collapse Item 属性
|属性名|说明|Type|Accepted Values|Default|
|:----|:----|:----|:----|:----|
|name|唯一标志符|string/number|—|—|
|title|面板标题|string|—|—|
|disabled|是否禁用|boolean|—|—|


### Collapse Item 插槽
|插槽名|说明|
|:----|:----|
|—|Collapse Item 的内容|
|title|Collapse Item 的标题|
