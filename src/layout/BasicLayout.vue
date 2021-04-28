<template>
  <div class="basic-layout">
    <slot name="wrapper" />
  </div>
</template>

<script>
export default {
  name: 'BasicLayout'
}
</script>

<style lang="scss" scoped>
  .basic-layout{
    padding: 12px;
    box-sizing: border-box;
  }
</style>
