<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>项目管理</span>
        </div>
        <!-- 操作 -->
        <div>
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button>
          <el-input
            v-model="queryParams.name"
            size="mini"
            placeholder="请输入内容"
            class="input-with-select"
            style="width: 300px; margin-left: 5px;"
            @keyup.enter.native="getList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getList" />
          </el-input>
        </div>
        <!-- 模型列表 -->
        <div style="margin-top: 15px;">
          <el-table v-loading="loading" :data="list" border>
            <el-table-column
              prop="name"
              label="名称"
            />
            <el-table-column
              prop="remarks"
              label="描述"
            />
            <el-table-column
              label="创建时间"
            >
              <template slot-scope="{row}">
                {{ parseTime(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="更新时间"
            >
              <template slot-scope="{row}">
                {{ parseTime(row.createdAt) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-link
                  icon="el-icon-edit"
                  type="primary"
                  :underline="false"
                  style="margin-left: 15px;"
                  @click="handleEdit(scope.row)"
                >编辑</el-link>
                <el-link
                  icon="el-icon-delete"
                  type="primary"
                  :underline="false"
                  style="margin-left: 15px;"
                  @click="handleDelete(scope.row.id)"
                >删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.page"
            :limit.sync="queryParams.per_page"
            @pagination="getList"
          />
        </div>
      </el-card>

      <el-dialog
        :title="dialog.title"
        :visible.sync="dialog.visible"
        width="30%"
      >
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="ruleForm.name" size="small" placeholder="请输入项目名称" />
          </el-form-item>
          <el-form-item label="项目描述" prop="remarks">
            <el-input v-model="ruleForm.remarks" type="textarea" rows="3" size="small" placeholder="请输入项目描述" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog.visible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </BasicLayout>
</template>

<script>
import {
  createProject,
  projectList,
  editProject,
  deleteProject
} from '@/api/k8s/project'
export default {
  data() {
    return {
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      dialog: {},
      ruleForm: {},
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        remarks: [
          { required: true, message: '请输入项目描述', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      projectList(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total_count
        this.loading = false
      })
    },
    handleCreate() {
      this.dialog = {
        title: '创建项目',
        status: 'create',
        visible: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    handleEdit(row) {
      this.ruleForm = JSON.parse(JSON.stringify(row))
      this.dialog = {
        title: '编辑项目',
        status: 'edit',
        visible: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.dialog.status === 'create') {
            createProject(this.ruleForm).then(() => {
              this.getList()
              this.dialog.visible = false
              this.$message({
                type: 'success',
                message: '新建项目成功'
              })
            })
          } else {
            editProject(this.ruleForm.id, {
              name: this.ruleForm.name,
              remarks: this.ruleForm.remarks
            }).then(() => {
              this.getList()
              this.dialog.visible = false
              this.$message({
                type: 'success',
                message: '编辑项目成功'
              })
            })
          }
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将删除项目, 是否继续?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteProject(id).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功'
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
