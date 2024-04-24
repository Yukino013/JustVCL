<script setup>
    import Collapse from '@/components/Collapse/Collapse.vue'
    import Item from '@/components/Collapse/CollapseItem.vue'
    import { ref } from 'vue'
    const openedValue = ref(['a'])
</script>
<template>
    <div>
       <Collapse v-model="openedValue">
      <Item name="a" title="第一个面板">
        <h1>第一个面板标题</h1>
        <div>第一个面板内容</div>
      </Item>
      <Item name="b" title="第二个面板">
        <h1>第二个面板标题</h1>
        <div>第二个面板内容</div>
      </Item>
      <Item name="c" title="禁用面板" disabled>
        <div>disabled</div>
      </Item>
    </Collapse>
</div>
</template>