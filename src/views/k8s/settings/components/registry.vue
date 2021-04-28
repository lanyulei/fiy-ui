<template>
  <div style="padding: 5px;">
    <div>
      <el-button size="mini" type="primary" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-input
        v-model="queryParams.ip"
        size="mini"
        placeholder="请输入IP地址"
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
          prop="architecture"
          label="CPU架构"
        />
        <el-table-column
          prop="protocol"
          label="协议"
        />
        <el-table-column
          prop="ip"
          label="IP地址"
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

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="30%"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="CPU架构" prop="architecture">
          <el-select v-model="ruleForm.architecture" size="small" placeholder="请选择架构" style="width: 100%;">
            <el-option label="x86_64" value="x86_64" />
            <el-option label="aarch64" value="aarch64" />
          </el-select>
        </el-form-item>
        <el-form-item label="协议" prop="protocol">
          <el-select v-model="ruleForm.protocol" size="small" placeholder="请选择协议" style="width: 100%;">
            <el-option label="http" value="http" />
            <el-option label="https" value="https" />
          </el-select>
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="ruleForm.ip" size="small" placeholder="请输入IP地址" />
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
  createRegistry,
  editRegistry,
  registryList,
  deleteRegistry
} from '@/api/k8s/settings'
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
        architecture: [
          { required: true, message: '请选择架构', trigger: 'change' }
        ],
        protocol: [
          { required: true, message: '请选择协议', trigger: 'change' }
        ],
        ip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
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
      registryList(this.queryParams).then(res => {
        this.list = res.data.list
        this.total = res.data.total_count
        this.loading = false
      })
    },
    handleCreate() {
      this.ruleForm = {}
      this.dialog = {
        title: '新建仓库信息',
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
        title: '编辑仓库信息',
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
            createRegistry(this.ruleForm).then(() => {
              this.getList()
              this.dialog.visible = false
              this.$message({
                type: 'success',
                message: '新建仓库信息成功'
              })
            })
          } else {
            editRegistry(this.ruleForm.id, this.ruleForm).then(() => {
              this.getList()
              this.dialog.visible = false
              this.$message({
                type: 'success',
                message: '编辑仓库信息成功'
              })
            })
          }
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将删除仓库信息, 是否继续?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteRegistry(id).then(() => {
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
