<template>
  <BasicLayout>
    <template #wrapper>
      <biz v-if="$route.params.classify === 'built_in_biz'" />
      <biz v-else />
    </template>
  </BasicLayout>
</template>

<script>
import biz from './details/biz'
export default {
  components: {
    biz
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
