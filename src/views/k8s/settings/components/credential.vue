<template>
  <div style="padding: 5px;">
    <div>
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-input
        v-model="queryParams.ip"
        size="mini"
        placeholder="请输入用户名"
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
          prop="username"
          label="用户民"
        />
        <el-table-column
          label="类型"
        >
          <template slot-scope="scope">
            {{ scope.row.type === 1 ? '密码' : '密钥' }}
          </template>
        </el-table-column>
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

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="30%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" size="small" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" size="small" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="ruleForm.type" size="small" placeholder="请选择类型" style="width: 100%;">
            <el-option label="密码" :value="1" />
            <el-option label="密钥" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item :label="ruleForm.type===1?'密码':'密钥'" prop="content">
          <el-input v-if="ruleForm.type===1" v-model="ruleForm.content" :type="password" size="small" placeholder="请输入密码">
            <template slot="append">
              <i class="el-icon-view" style="cursor:pointer; font-size: 18px;" @click="password === '' ? password = 'password' : password = ''" />
            </template>
          </el-input>
          <el-input v-else v-model="ruleForm.content" type="textarea" size="small" placeholder="请输入密钥" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  createCredential,
  editCredential,
  credentialList,
  deleteCredential
} from '@/api/k8s/settings'
export default {
  data() {
    return {
      password: 'password',
      loading: false,
      list: null,
      total: 0,
      queryParams: {},
      dialog: {},
      ruleForm: {
        type: 1
      },
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '必选', trigger: 'change' }
        ],
        content: [
          { required: true, message: '必填', trigger: 'blur' }
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
      credentialList(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total_count
        this.loading = false
      })
    },
    handleCreate() {
      this.ruleForm = {
        type: 1
      }
      this.dialog = {
        title: '新建凭据',
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
        title: '编辑凭据',
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
            createCredential(this.ruleForm).then(() => {
              this.getList()
              this.dialog.visible = false
              this.$message({
                type: 'success',
                message: '新建凭据成功'
              })
            })
          } else {
            editCredential(this.ruleForm.id, this.ruleForm).then(() => {
              this.getList()
              this.dialog.visible = false
              this.$message({
                type: 'success',
                message: '编辑凭据成功'
              })
            })
          }
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将删除凭据, 是否继续?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteCredential(id).then(() => {
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
