<template>
  <div>
    <el-alert
      title="选填,为集群提供对时服务"
      type="info"
      show-icon
    />
    <el-form ref="ruleForm" style="margin-top: 18px;" :model="ruleForm" label-width="120px">
      <el-form-item label="NTP Server: ">
        <el-input v-model="ruleForm.server" placeholder="请输入NTP Server" style="width: 35%" />
      </el-form-item>
      <el-form-item style="margin-bottom: 10px;">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getNTPServer,
  saveNTPServer
} from '@/api/k8s/settings'
export default {
  data() {
    return {
      ruleForm: {}
    }
  },
  created() {
    this.getDetails()
  },
  methods: {
    getDetails() {
      getNTPServer().then(res => {
        this.ruleForm = res.data
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveNTPServer({
            server: this.ruleForm.server
          }).then(res => {
            this.getDetails()
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
