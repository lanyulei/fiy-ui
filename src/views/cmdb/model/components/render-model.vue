<template>
  <div style="padding: 0 20px 20px 20px">
    <el-form v-if="formStatus" ref="fieldData" label-width="150px" :model="fieldData" :rules="rules">
      <div v-for="(item, index) in fields" :key="index" style="margin-top: 23px">
        <div style="font-size: 15px; font-weight: 500;">
          <i class="el-icon-arrow-right" style="font-size: 12px;" />
          {{ item.name }}
        </div>
        <div style="margin-top: 15px;">
          <el-form-item
            v-for="(fieldItem, fieldIndex) in item.fields"
            :key="fieldIndex"
            :label="fieldItem.name"
            :prop="fieldItem.identifies"
          >
            <div v-if="fieldItem.type === 'string'">
              <el-input
                v-model="fieldData[fieldItem.identifies]"
                :disabled="fieldItem.configuration.is_edit?false:true"
                size="small"
                :placeholder="'请输入' + fieldItem.name"
              />
            </div>
            <div v-if="fieldItem.type === 'number'">
              <el-input-number
                v-model="fieldData[fieldItem.identifies]"
                size="small"
                :disabled="fieldItem.configuration.is_edit?false:true"
                :min="fieldItem.configuration.min_number"
                :max="fieldItem.configuration.max_number"
              />
            </div>
            <div v-else-if="fieldItem.type === 'enum'">
              <el-select v-model="fieldData[fieldItem.identifies]" size="small" :placeholder="'请选择' + fieldItem.name" style="width: 100%">
                <el-option
                  v-for="listItem of fieldItem.configuration.enum_list"
                  :key="listItem.uuid"
                  :label="listItem.value"
                  :value="listItem.uuid"
                />
              </el-select>
            </div>
            <div v-else-if="fieldItem.type === 'list'">
              <el-select v-model="fieldData[fieldItem.identifies]" size="small" :placeholder="'请选择' + fieldItem.name" style="width: 100%">
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
                v-model="fieldData[fieldItem.identifies]"
                style="width: 100%"
                size="small"
                type="date"
                :placeholder="'请选择' + fieldItem.name"
              />
            </div>
            <div v-else-if="fieldItem.type === 'time'">
              <el-time-picker
                v-model="fieldData[fieldItem.identifies]"
                style="width: 100%"
                size="small"
                :placeholder="'请选择' + fieldItem.name"
              />
            </div>
            <div v-else-if="fieldItem.type === 'bool'">
              <el-switch
                v-model="fieldData[fieldItem.identifies]"
                size="small"
              />
            </div>
            <div v-else-if="fieldItem.type === 'user'">
              <el-select v-model="fieldData[fieldItem.identifies]" size="small" style="width: 100%" :placeholder="'请选择' + fieldItem.name">
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
                  v-model="fieldData[fieldItem.identifies]"
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
        </div>
      </div>
      <div style="text-align: center; padding-bottom: 30px; padding-top: 20px;">
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { fetchList } from '@/api/user'
import {
  createData,
  editData
} from '@/api/universe/resource'
  // import { treeselect } from '@/api/system/dept'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    isSubmit: {
      type: String,
      default: ''
    },
    fieldData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
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
      fetchList({
        page: 1,
        limit: 999999
      }).then(response => {
        console.log(response.data)
        this.userList = response.data.list
      })
    },
    submitForm() {
      this.$refs.fieldData.validate((valid) => {
        if (valid) {
          if (this.isSubmit !== '') {
            if (this.isSubmit === 'create') {
              createData({
                info_id: parseInt(this.$route.query.classify),
                data: this.fieldData
              }).then(res => {
                this.closeDialog()
                this.$emit('getList')
                this.$message({
                  type: 'success',
                  message: '创建成功!'
                })
              })
            } else if (this.isSubmit === 'edit') {
              var fieldDataValue = JSON.parse(JSON.stringify(this.fieldData))
              delete fieldDataValue.id
              delete fieldDataValue.info_id
              delete fieldDataValue.uuid
              editData(this.fieldData.id, {
                info_id: this.fieldData.info_id,
                uuid: this.fieldData.uuid,
                data: fieldDataValue
              }).then(res => {
                this.closeDialog()
                this.$emit('getList')
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
              })
            }
          }
        } else {
          return false
        }
      })
    },
    closeDialog() {
      this.$emit('update:bizDialog', false)
    },
    clearValidateHandle() {
      this.$refs.fieldData.clearValidate()
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
