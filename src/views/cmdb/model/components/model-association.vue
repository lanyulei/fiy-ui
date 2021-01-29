<template>
  <div>
    <el-button size="small" type="primary" style="margin-bottom: 13px" @click="addModelAssociation">新建关联</el-button>
    <el-table
      border
      :data="list"
      style="width: 100%"
    >
      <el-table-column
        prop="related_type_name"
        label="关联类型"
      />
      <el-table-column
        label="源-目标约束"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.constraint === 1">1 - 1</span>
          <span v-else-if="scope.row.constraint === 2">1 - N</span>
          <span v-else-if="scope.row.constraint === 3">N - N</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="source_model_name"
        label="源模型"
      />
      <el-table-column
        prop="target_model_name"
        label="目标模型"
      />
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

    <!-- 新建/编辑关联 -->
    <el-dialog
      :title="relatedDialog.title"
      :visible.sync="relatedDialog.dialog"
      width="30%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
        <el-form-item label="目标模型" prop="target">
          <el-select v-model="ruleForm.target" placeholder="请选择目标模型" size="small" style="width: 100%">
            <el-option-group
              v-for="group in groupModelList"
              :key="group.id"
              :label="group.name"
            >
              <el-option
                v-for="modelItem in group.model_list"
                :key="modelItem.id"
                :label="modelItem.name"
                :value="modelItem.id"
              />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="关联类型" prop="related_type_id">
          <el-select v-model="ruleForm.related_type_id" placeholder="请选择关联类型" style="width: 100%" size="small">
            <el-option
              v-for="relatedItem in relatedList"
              :key="relatedItem.id"
              :label="relatedItem.name"
              :value="relatedItem.id"
            >
              {{ relatedItem.identifies }} ( {{ relatedItem.name }} )
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="源-目标约束" prop="constraint">
          <el-select v-model="ruleForm.constraint" placeholder="请选择源-目标约束" style="width: 100%" size="small">
            <el-option
              v-for="constraintItem in constraintOptions"
              :key="constraintItem.value"
              :label="constraintItem.label"
              :value="constraintItem.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联描述">
          <el-input
            v-model="ruleForm.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入关联描述"
            size="small"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="relatedDialog.dialog = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  updateUniqueField,
  createModelRelated,
  modelRelatedList,
  associationTypeList,
  modelList
} from '@/api/cmdb/model'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modelId'],
  data() {
    return {
      list: [],
      relatedList: [],
      relatedDialog: {},
      groupModelList: [],
      constraintOptions: [{
        label: 'N - N',
        value: 3
      }, {
        label: '1 - N',
        value: 2
      }, {
        label: '1 - 1',
        value: 1
      }],
      ruleForm: {},
      rules: {
        source: [
          { required: true, message: '源模型必选', trigger: 'change' }
        ],
        target: [
          { required: true, message: '目标模型必选', trigger: 'change' }
        ],
        related_type_id: [
          { required: true, message: '关联类型必选', trigger: 'change' }
        ],
        constraint: [
          { required: true, message: '源-目标约束必选', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getModelList()
  },
  methods: {
    getList() {
      modelRelatedList().then(res => {
        this.list = res.data
      })
    },
    getRelatedList() {
      associationTypeList({
        per_page: 9999
      }).then(res => {
        this.relatedList = res.data.list
      })
    },
    getModelList() {
      modelList({
        isUsable: 1
      }).then(res => {
        this.groupModelList = res.data
      })
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
    addModelAssociation() {
      this.ruleForm = {}
      this.relatedDialog = {
        title: '新建关联',
        status: 'create',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.source = this.modelId
          if (this.ruleForm.source !== this.ruleForm.target) {
            createModelRelated(this.ruleForm).then(res => {
              console.log(res)
            })
          } else {
            this.$message({
              type: 'error',
              message: '源模型和目标模型不能是同一个'
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
