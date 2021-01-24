<template>
  <div style="padding: 0 0 20px 20px">
    <el-form v-if="formStatus" ref="ruleForm" :model="ruleForm" :rules="rules" label-position="top">
      <div v-for="(item, index) in fields" :key="index" style="margin-top: 23px">
        <div style="font-size: 15px; font-weight: 500;">
          <i class="el-icon-arrow-right" style="font-size: 12px;" />
          {{ item.name }}
        </div>
        <el-row>
          <el-col
            v-for="(fieldItem, fieldIndex) in item.fields"
            :key="fieldIndex"
            :span="12"
            style="padding-right: 15px; margin-top: 15px;"
          >
            <el-form-item :label="fieldItem.name" :prop="fieldItem.identifies">
              <div v-if="fieldItem.type === 'string'">
                <el-input
                  v-model="fieldItem.default_value"
                  :disabled="fieldItem.configuration.is_edit?false:true"
                  size="small"
                  :placeholder="'请输入' + fieldItem.name"
                />
              </div>
              <div v-if="fieldItem.type === 'number'">
                <el-input-number
                  v-model="fieldItem.default_value"
                  size="small"
                  :disabled="fieldItem.configuration.is_edit?false:true"
                  :min="fieldItem.configuration.min_number"
                  :max="fieldItem.configuration.max_number"
                />
              </div>
              <div v-else-if="fieldItem.type === 'enum'">
                <el-select v-model="fieldItem.default_value" size="small" :placeholder="'请选择' + fieldItem.name" style="width: 100%">
                  <el-option
                    v-for="listItem of fieldItem.configuration.enum_list"
                    :key="listItem.uuid"
                    :label="listItem.value"
                    :value="listItem.uuid"
                  />
                </el-select>
              </div>
              <div v-else-if="fieldItem.type === 'list'">
                <el-select v-model="fieldItem.default_value" size="small" :placeholder="'请选择' + fieldItem.name" style="width: 100%">
                  <el-option
                    v-for="listItem of fieldItem.configuration.list_value"
                    :key="listItem.value"
                    :label="listItem.value"
                    :value="listItem.value"
                  />
                </el-select>
              </div>
              <div v-else-if="fieldItem.type === 'date'">
                <el-date-picker
                  v-model="fieldItem.default_value"
                  style="width: 100%"
                  size="small"
                  type="date"
                  :placeholder="'请选择' + fieldItem.name"
                />
              </div>
              <div v-else-if="fieldItem.type === 'time'">
                <el-time-picker
                  v-model="fieldItem.default_value"
                  style="width: 100%"
                  size="small"
                  :placeholder="'请选择' + fieldItem.name"
                />
              </div>
              <div v-else-if="fieldItem.type === 'bool'">
                <el-switch
                  v-model="fieldItem.default_value"
                  size="small"
                />
              </div>
              <div v-else-if="fieldItem.type === 'user'">
                <el-select v-model="fieldItem.default_value" size="small" style="width: 100%" :placeholder="'请选择' + fieldItem.name">
                  <el-option
                    v-for="userItem in userList"
                    :key="userItem.userId"
                    :label="userItem.nickName"
                    :value="userItem.userId"
                  />
                </el-select>
              </div>
              <!-- <div v-else-if="fieldItem.type === 'depart'">
                <el-cascader
                  v-model="fieldItem.default_value"
                  style="width: 100%"
                  :options="deptOptions"
                  :show-all-levels="false"
                  size="small"
                >
                  <template slot-scope="{ data }">
                    <span>{{ data.deptName }}</span>
                  </template>
                </el-cascader>
              </div> -->
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { listUser } from '@/api/system/sysuser'
// import { treeselect } from '@/api/system/dept'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['fields'],
  data() {
    return {
      formStatus: false,
      ruleForm: {},
      userList: [],
      deptOptions: [],
      rules: {}
    }
  },
  created() {
    this.generateRules()
    this.getUserList()
    // this.getTreeselect()
  },
  methods: {
    generateRules() {
      for (var fieldGroup of this.fields) {
        for (var field of fieldGroup.fields) {
          if (field.required) {
            if (field.type === 'string') {
              this.rules[field.identifies] = [
                { required: true, message: `请输入${field.name}`, trigger: 'blur' }
              ]
              if (field.configuration.regular !== undefined &&
              field.configuration.regular !== null &&
              field.configuration.regular !== '') {
                this.rules[field.identifies].push(
                  { pattern: field.configuration.regular, message: '数据校验失败', trigger: 'blur' }
                )
              }
            } else if (field.type === 'number') {
              this.rules[field.identifies] = [
                { required: true, message: `请输入${field.name}`, trigger: 'change' }
              ]
            } else {
              this.rules[field.identifies] = [
                { required: true, message: `请选择${field.name}`, trigger: 'change' }
              ]
            }
          }
        }
      }
      this.formStatus = true
    },
    getUserList() {
      listUser({
        pageIndex: 1,
        pageSize: 999999
      }).then(response => {
        this.userList = response.data.list
      })
    }
    // getTreeselect() {
    //   treeselect().then(response => {
    //     this.deptOptions = response.data
    //   })
    // }
  }
}
</script>

<style scoped>

</style>
