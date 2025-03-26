<template>
  <view class="container">
    <text class="title">Lynx Simple Component</text>
  </view>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LynxSimple'
})
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #f0f0f0;
}
.title {
  font-size: 24px;
  color: #333;
}
</style> 
