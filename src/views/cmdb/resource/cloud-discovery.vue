<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 提示 -->
        <div style="margin-bottom: 15px;">
          <el-alert
            style="background: #F0F8FF; color: #63656E"
            title="配置云主机任务，自动发现并同步新增或属性有变更的主机到主机池"
            type="info"
            show-icon
          />
        </div>

        <!-- 操作 -->
        <div>
          <el-row>
            <el-button size="mini" type="primary" @click="addSyncTask">新建</el-button>
            <el-input
              v-model="listQuery.name"
              size="mini"
              placeholder="请输入任务名称"
              class="input-with-select"
              style="width: 300px; margin-left: 10px"
              @keyup.enter.native="getList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getList" />
            </el-input>
          </el-row>
        </div>

        <!-- 任务同步列表失败 -->
        <div style="margin-top: 15px;">
          <el-table v-loading="loading" :data="list" border>
            <el-table-column
              prop="name"
              label="任务名称"
            />
            <el-table-column
              prop="model_info_name"
              label="绑定模型"
            />
            <el-table-column
              prop="cloud_account_name"
              label="账户名称"
            />
            <el-table-column
              label="账户类型"
            >
              <template slot-scope="{row}">
                {{ getAccountType(row.cloud_account_type) }}
              </template>
            </el-table-column>
            <el-table-column
              label="云资源类型"
            >
              <template slot-scope="{row}">
                <span v-if="row.resource_type === 1">
                  云服务器
                </span>
              </template>
            </el-table-column>
            <el-table-column
              label="最近同步状态"
            >
              <template v-if="row.last_sync_time.Valid" slot-scope="{row}">
                <el-tag v-if="row.status" size="small" type="success">成功</el-tag>
                <el-tag v-else type="danger" size="small">失败</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="last_sync_time"
              label="最近同步时间"
              width="160"
            >
              <template slot-scope="{row}">
                <span v-if="row.last_sync_time.Valid">{{ row.last_sync_time.Time | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                <span v-else />
              </template>
            </el-table-column>
            <el-table-column
              prop="modifier_name"
              label="修改人"
            />
            <el-table-column
              label="状态"
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status" size="small" type="success">可用</el-tag>
                <el-tag v-else type="danger" size="small">暂停</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150px;">
              <template slot-scope="scope">
                <el-link
                  icon="el-icon-edit"
                  type="primary"
                  :underline="false"
                  @click="edSyncTask(scope.row)"
                >编辑</el-link>
                <el-link
                  icon="el-icon-delete"
                  type="primary"
                  :underline="false"
                  style="margin-left: 15px;"
                  @click="delSyncTask(scope.row.id)"
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
          width="50%"
        >
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
            <el-form-item label="任务名称" prop="name">
              <el-input v-model="ruleForm.name" size="small" placeholder="请输入任务名称" />
            </el-form-item>
            <el-form-item label="账号名称" prop="cloud_account">
              <el-select
                v-model="ruleForm.cloud_account"
                size="small"
                placeholder="请选择账号名称"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in accountList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <span style="float: left;">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">
                    {{ getAccountType(item.type) }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资源模型" prop="resource_model">
              <el-select
                v-model="ruleForm.resource_model"
                size="small"
                placeholder="请选择资源模型"
                style="width: 100%"
                filterable
              >
                <el-option-group
                  v-for="group in groupModelList.models"
                  :key="group.id"
                  :label="group.name"
                >
                  <el-option
                    v-for="item in group.model_list"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="资源类型" prop="resource_type">
              <el-select
                v-model="ruleForm.resource_type"
                size="small"
                placeholder="请输入任务名称"
                disabled
                style="width: 100%"
              >
                <el-option label="云服务器" :value="1" />
              </el-select>
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
            <el-form-item v-if="dialogForm.status === 'edit'" label="状态">
              <el-switch
                v-model="ruleForm.status"
                size="small"
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
  cloudAccountList,
  createCloudDiscovery,
  cloudDiscoveryList,
  editCloudDiscovery,
  deleteCloudDiscovery
} from '@/api/cmdb/resource'

import {
  modelList
} from '@/api/cmdb/model'

export default {
  components: {
  },
  data() {
    return {
      groupModelList: [],
      accountList: [],
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
        name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
        cloud_account: [{ required: true, message: '请选择账号名称', trigger: 'change' }],
        resource_model: [{ required: true, message: '请选择资源模型', trigger: 'change' }],
        field_map: [{ required: true, message: '请输入字段映射', trigger: 'blur' }],
        region: [{ required: true, message: '请输入区域', trigger: 'change' }]
      }
    }
  },
  created() {
    this.initFunc()
  },
  methods: {
    initFunc() {
      this.getList()
      this.getCloudAccountList()
      this.getModelList()
    },
    getList() {
      this.loading = true
      cloudDiscoveryList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total_count
        this.loading = false
      })
    },
    getCloudAccountList() {
      cloudAccountList({
        per_page: 9999
      }).then(res => {
        this.accountList = res.data.list
      })
    },
    getModelList() {
      modelList({
        isUsable: 1
      }).then(res => {
        this.groupModelList = res.data
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
    addSyncTask() {
      this.ruleForm = { status: true }
      this.dialogForm = {
        title: '新建云资源同步',
        status: 'create',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    edSyncTask(row) {
      this.ruleForm = row
      this.dialogForm = {
        title: '编辑云资源同步',
        status: 'edit',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    delSyncTask(id) {
      this.$confirm('是否删除此云资源同步?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteCloudDiscovery(id).then(() => {
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
            createCloudDiscovery(this.ruleForm).then(() => {
              this.getList()
              this.$message({
                type: 'success',
                message: '创建成功!'
              })
            })
          } else if (this.dialogForm.status === 'edit') {
            editCloudDiscovery(this.ruleForm.id, this.ruleForm).then(() => {
              this.getList()
              this.$message({
                type: 'success',
                message: '更新成功!'
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
  .div-json-field-map{
    border-radius: 4px;
    /deep/ .jsoneditor-poweredBy{
      display: none;
    }
    /deep/ div.jsoneditor {
      border: 1px solid #dfe6ec;
      border-radius: 4px;
      overflow: hidden;
    }
    /deep/ .jsoneditor-vue{
      height:300px;
    }
  }
</style>
