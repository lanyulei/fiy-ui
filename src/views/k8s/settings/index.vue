<template>
  <BasicLayout>
    <template #wrapper>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="仓库" name="1">
          <registry />
        </el-tab-pane>
        <el-tab-pane label="凭据" name="2">
          <credential />
        </el-tab-pane>
        <el-tab-pane label="NTP" name="3">
          <ntp />
        </el-tab-pane>
      </el-tabs>
    </template>
  </BasicLayout>
</template>

<script>
import registry from './components/registry'
import credential from './components/credential'
import ntp from './components/ntp'
export default {
  components: {
    registry,
    credential,
    ntp
  },
  data() {
    return {
      activeName: '1'
    }
  },
  created() {
    if (this.$route.query.tab === undefined || this.$route.query.tab === null) {
      this.activeName = '1'
    } else {
      this.activeName = this.$route.query.tab
    }
  },
  methods: {
    handleClick(tab, event) {
      this.$router.push({ path: `/k8s/settings/index/?tab=${tab.name}` })
    }
  }
}
</script>

<style scoped>

</style>
