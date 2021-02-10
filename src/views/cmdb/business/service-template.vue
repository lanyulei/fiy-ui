<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 提示 -->
        <div style="margin-bottom: 15px;">
          <el-alert
            style="background: #F0F8FF; color: #63656E"
            title="服务模板可以预定义业务通用的服务，用于业务拓扑中批量部署和变更服务实例。"
            type="info"
            show-icon
          />
        </div>

        <!-- 操作 -->
        <div>
          <el-row>
            <el-button size="mini" type="primary" @click="createData">新建</el-button>
            <el-input
              v-model="listQuery.name"
              size="mini"
              placeholder="请输入服务模板名称"
              class="input-with-select"
              style="width: 300px; margin-left: 10px"
              @keyup.enter.native="getList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getList" />
            </el-input>
          </el-row>
        </div>

        <div style="margin-top: 15px;">
          <el-table v-loading="loading" :data="list" border>
            <el-table-column
              prop="name"
              label="账户名称"
            />
            <el-table-column
              prop="type"
              label="账户类型"
            >
              <template slot-scope="{row}">
                {{ getAccountType(row.type) }}
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status" type="success">可用</el-tag>
                <el-tag v-else type="danger">暂停</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="modifier_name"
              label="修改人"
            />
            <el-table-column
              label="修改时间"
            >
              <template slot-scope="{row}">
                {{ row.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150px;">
              <template slot-scope="scope">
                <el-link
                  icon="el-icon-edit"
                  type="primary"
                  :underline="false"
                  @click="edCloudAccount(scope.row)"
                >编辑</el-link>
                <el-link
                  icon="el-icon-delete"
                  type="primary"
                  :underline="false"
                  style="margin-left: 15px;"
                  @click="delCloudAccount(scope.row.id)"
                >删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.per_page"
            @pagination="getList"
          />
        </div>

      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  createCloudAccount,
  cloudAccountList,
  deleteCloudAccount
} from '@/api/cmdb/resource'
import {
  serviceClassifyList
} from '@/api/cmdb/business'
export default {
  components: {
  },
  data() {
    return {
      setKey: {
        value: 'id',
        label: 'name',
        children: 'services'
      }, // 自定义  级联选择器value label
      loading: false,
      ruleForm: {},
      list: [],
      sclist: [],
      total: 0,
      listQuery: {
        page: 1,
        per_page: 10
      },
      dialogForm: { },
      processDialog: { },
      processRuleForm: {},
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        alias: [{ required: true, message: '必填', trigger: 'blur' }],
        svc_classify: [{ required: true, message: '必选', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    this.getSvcClassifyList()
  },
  methods: {
    getList() {
      this.loading = true
      cloudAccountList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total_count
        this.loading = false
      })
    },
    getSvcClassifyList() {
      serviceClassifyList().then(res => {
        this.sclist = res.data
      })
    },
    createData() {
      this.$router.push({ name: 'BusinessSvcTplManager', query: { status: 'create' }})
    },
    createProcessData() {
      this.processDialog = {
        title: '新建流程',
        status: 'create',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    edCloudAccount(row) {
      this.ruleForm = row
      this.dialogForm = {
        title: '编辑云账号',
        status: 'edit',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    delCloudAccount(id) {
      this.$confirm('是否删除此云账号?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteCloudAccount(id).then(() => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 新建云账号
          if (this.dialogForm.status === 'create') {
            createCloudAccount(this.ruleForm).then(res => {
              this.getList()
              this.$message({
                type: 'success',
                message: '创建成功!'
              })
            })
          }
          this.dialogForm.dialog = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .create-template-title {
    color: #63656e;
    font-size: 16px;
    padding-bottom: 10px;
    font-weight: 700;
  }

  /deep/ .create-process-dialog .el-form-item__label {
    padding: 0;
    line-height: 25px;
  }

  /deep/ .create-process-dialog .el-form-item {
    margin-bottom: 10px;
  }
</style>
