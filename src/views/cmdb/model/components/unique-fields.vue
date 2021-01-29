<template>
  <div>
    <el-button size="small" type="primary" style="margin-bottom: 13px" @click="addUniqueFieldHandle">新建校验</el-button>
    <el-table
      border
      :data="tableUniqueData"
      style="width: 100%"
    >
      <el-table-column
        prop="identifies"
        label="唯一标识"
      />
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        label="属性为空值时是否校验"
      >
        <template>是</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link
            icon="el-icon-delete"
            type="primary"
            :underline="false"
            style="margin-left: 15px;"
            @click="uniqueFieldDelete(scope.row.id)"
          >删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新建校验"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="字段名称" prop="fieldId">
          <el-select v-model="ruleForm.fieldId" placeholder="请选择字段名称" filterable clearable size="small" style="width: 100%">
            <el-option
              v-for="item in allField"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUniqueFields,
  updateUniqueField
} from '@/api/cmdb/model'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modelId', 'fields'],
  data() {
    return {
      allField: [],
      tableUniqueData: [],
      ruleForm: {},
      dialogVisible: false,
      rules: {
        fieldId: [
          { required: true, message: '字段名称必选', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    getList() {
      getUniqueFields(this.modelId).then(res => {
        this.tableUniqueData = res.data
      })
    },
    getUniqueFieldsHandle() {
      this.allField = []
      // 所有字段
      for (var group of this.fields) {
        for (var field of group.fields) {
          this.allField.push(field)
        }
      }

      this.getList()
    },
    uniqueFieldDelete(fieldId) {
      this.$confirm('是否删除唯一校验?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        updateUniqueField(fieldId, {
          unique_status: 'delete'
        }).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    addUniqueFieldHandle() {
      this.ruleForm = {}
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          updateUniqueField(this.ruleForm.fieldId, {
            unique_status: 'create'
          }).then(() => {
            this.getList()
            this.$message({
              type: 'success',
              message: '创建成功!'
            })
            this.dialogVisible = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
