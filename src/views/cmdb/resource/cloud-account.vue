<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 提示 -->
        <div style="margin-bottom: 15px;">
          <el-alert
            style="background: #F0F8FF; color: #63656E"
            title="录入云账户信息后，可进行云资产数据同步"
            type="info"
            show-icon
          />
        </div>

        <!-- 操作 -->
        <div>
          <el-row>
            <el-button size="mini" type="primary" @click="addCloudAccount">新建</el-button>
            <el-input
              v-model="listQuery.name"
              size="mini"
              placeholder="请输入账号名称"
              class="input-with-select"
              style="width: 300px; margin-left: 10px"
              @keyup.enter.native="getList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getList" />
            </el-input>
          </el-row>
        </div>

        <!-- 云账户列表 -->
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

        <!-- 新建/编辑 -->
        <el-dialog
          :title="dialogForm.title"
          :visible.sync="dialogForm.dialog"
          width="38%"
        >
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
            <el-form-item label="账号名称" prop="name">
              <el-input v-model="ruleForm.name" size="small" placeholder="请输入账号名称" />
            </el-form-item>
            <el-form-item label="账户类型" prop="type">
              <el-select v-model="ruleForm.type" size="small" placeholder="请选择账户类型" style="width: 100%">
                <el-option
                  v-for="item in accountTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span style="float: left">
                    <svg-icon :icon-class="item.icon" style="margin-right: 5px; font-size: 16px;" />
                    {{ item.label }}
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Secret" prop="secret">
              <el-input v-model="ruleForm.secret" size="small" placeholder="请输入Secret" />
            </el-form-item>
            <el-form-item label="KeyId" prop="key">
              <el-input v-model="ruleForm.key" size="small" placeholder="请输入KeyId" />
            </el-form-item>
            <el-form-item label="区域" prop="region">
              <el-select
                v-model="ruleForm.region"
                style="width: 100%"
                size="small"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请输入区域"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="ruleForm.remarks"
                type="textarea"
                :rows="3"
                placeholder="请输入备注"
              />
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogForm.dialog = false">取 消</el-button>
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </span>
        </el-dialog>

      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  createCloudAccount,
  cloudAccountList,
  deleteCloudAccount,
  editCloudAccount
} from '@/api/cmdb/resource'
export default {
  components: {
  },
  data() {
    return {
      accountTypeOptions: [
        { icon: 'alibabacloud', label: '阿里云', value: 'aliyun' },
        { icon: 'tengxunyun', label: '腾讯云', value: 'tencent' }
      ],
      loading: false,
      ruleForm: { status: true },
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        per_page: 10
      },
      dialogForm: {},
      rules: {
        name: [{ required: true, message: '请输入账号名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择账户类型', trigger: 'change' }],
        secret: [{ required: true, message: '请输入AccessSecret', trigger: 'blur' }],
        key: [{ required: true, message: '请输入AccessKeyId', trigger: 'blur' }],
        region: [{ required: true, message: '请输入区域', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
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
    getAccountType(value) {
      for (var i of this.accountTypeOptions) {
        if (i.value === value) {
          return i.label
        }
      }
      return ''
    },
    addCloudAccount() {
      this.ruleForm = { status: true }
      this.dialogForm = {
        title: '新建云账号',
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
            createCloudAccount(this.ruleForm).then(() => {
              this.getList()
              this.$message({
                type: 'success',
                message: '创建成功!'
              })
            })
          } else if (this.dialogForm.status === 'edit') {
            editCloudAccount(this.ruleForm.id, this.ruleForm).then(() => {
              this.getList()
              this.$message({
                type: 'success',
                message: '编辑成功!'
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

<style scoped>

</style>
