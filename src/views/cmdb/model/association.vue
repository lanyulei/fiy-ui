<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 提示 -->
        <div style="margin-bottom: 15px;">
          <el-alert
            style="background: #F0F8FF; color: #63656E"
            title="“关联类型”是模型关联的分类，如主机于交换机、路由之间的关系都可以分类为“上联”类型。"
            type="info"
            show-icon
          />
        </div>
        <!-- 操作 -->
        <div>
          <el-row>
            <el-button size="mini" type="primary" @click="addAssociation">新建</el-button>
            <el-input
              v-model="queryParams.name"
              size="mini"
              placeholder="请输入名称"
              class="input-with-select"
              style="width: 300px; margin-left: 10px"
              @keyup.enter.native="getList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getList" />
            </el-input>
          </el-row>
        </div>
        <!-- 模型列表 -->
        <div style="margin-top: 15px;">
          <el-table v-loading="loading" :data="list" border>
            <el-table-column
              prop="identifies"
              label="唯一标识"
            />
            <el-table-column
              prop="name"
              label="名称"
            />
            <el-table-column
              prop="source_describe"
              label="源->目标描述"
            />
            <el-table-column
              prop="target_describe"
              label="目标->源描述"
            />
            <el-table-column
              label="使用数"
            >
              <template>
                0
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-link
                  icon="el-icon-edit"
                  type="primary"
                  :underline="false"
                  @click="editAssociationTypeHandle(scope.row)"
                >编辑</el-link>
                <el-link
                  icon="el-icon-delete"
                  type="primary"
                  :underline="false"
                  style="margin-left: 15px;"
                  @click="deleteAssociationTypeHandle(scope.row.id)"
                >删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <!-- 新建/编辑关联类型 -->
      <el-dialog
        :title="relatedType.title"
        :visible.sync="relatedType.dialog"
        width="38%"
      >
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="110px">
          <el-form-item label="唯一标识" prop="identifies">
            <el-input v-model="ruleForm.identifies" size="small" />
          </el-form-item>
          <el-form-item label="字段名称" prop="name">
            <el-input v-model="ruleForm.name" size="small" />
          </el-form-item>
          <el-form-item label="源->目标描述" prop="source_describe">
            <el-input v-model="ruleForm.source_describe" size="small" />
          </el-form-item>
          <el-form-item label="目标->源描述" prop="target_describe">
            <el-input v-model="ruleForm.target_describe" size="small" />
          </el-form-item>
          <el-form-item label="是否有方向" prop="direction">
            <el-radio-group v-model="ruleForm.direction" size="small">
              <el-radio :label="1">有，源指向目标</el-radio>
              <el-radio :label="2">双向</el-radio>
              <el-radio :label="3">无方向</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="relatedType.dialog = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </el-dialog>

    </template>
  </BasicLayout>
</template>

<script>
import {
  createAssociationType,
  associationTypeList,
  updateAssociationType,
  deleteAssociationType
} from '@/api/cmdb/model'
export default {
  components: {

  },
  data() {
    var validateIdentifies = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('格式不正确，请填写英文开头，下划线，数字，英文的组合'))
      }
    }
    return {
      relatedType: {},
      loading: false,
      list: [],
      queryParams: {
        page: 1,
        per_page: 10
      },
      ruleForm: {
        direction: 1
      },
      rules: {
        identifies: [
          { required: true, message: '请输入唯一标识', trigger: 'blur' },
          { validator: validateIdentifies, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入字段名称', trigger: 'blur' }
        ],
        source_describe: [
          { required: true, message: '请输入源->目标描述', trigger: 'blur' }
        ],
        target_describe: [
          { required: true, message: '请输入目标->源描述', trigger: 'blur' }
        ],
        direction: [
          { required: true, message: '请请选方向', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      associationTypeList(this.queryParams).then(res => {
        this.list = res.data.list
      })
    },
    addAssociation() {
      this.ruleForm = {
        direction: 1
      }
      this.relatedType = {
        title: '新建关联',
        status: 'create',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    editAssociationTypeHandle(row) {
      this.ruleForm = row
      this.relatedType = {
        title: '编辑关联',
        status: 'edit',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.relatedType.status === 'create') {
            createAssociationType(this.ruleForm).then(res => {
              this.getList()
              this.$message({
                type: 'success',
                message: '创建关联类型成功'
              })
            })
          } else if (this.relatedType.status === 'edit') {
            updateAssociationType(this.ruleForm.id, {
              identifies: this.ruleForm.identifies,
              name: this.ruleForm.name,
              source_describe: this.ruleForm.source_describe,
              target_describe: this.ruleForm.target_describe,
              direction: this.ruleForm.direction
            }).then(res => {
              this.getList()
              this.$message({
                type: 'success',
                message: '编辑关联类型成功'
              })
            })
          }
          this.relatedType.dialog = false
        }
      })
    },
    deleteAssociationTypeHandle(associationId) {
      this.$confirm('是否删除关联分类?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteAssociationType(associationId).then(() => {
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
    }
  }
}
</script>

<style scoped>

</style>
