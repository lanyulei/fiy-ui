<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>新建服务模版</span>
        </div>
        <div style="padding: 10px">
          <div class="create-template-title">基本属性</div>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
            <el-form-item label="账号名称" prop="name">
              <el-input v-model="ruleForm.name" style="width:30%" size="small" placeholder="请输入账号名称" />
            </el-form-item>
            <el-form-item label="服务分类" prop="svc_classify">
              <el-select
                v-model="ruleForm.svc_classify"
                style="width:30%"
                size="small"
                filterable
                placeholder="请选择服务分类"
              >
                <el-option-group
                  v-for="group in sclist"
                  :key="group.id"
                  :label="group.name"
                >
                  <el-option
                    v-for="item in group.services"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="create-template-title">服务进程</div>
          <div>
            <div style="margin-left: 22px">
              <el-button plain size="small" style="margin-right: 10px;" @click="createProcessData">
                <i class="el-icon-plus" />
                新建进程
              </el-button>
            </div>
            <div style="margin-left: 22px; margin-top: 10px">
              <el-table v-loading="loading" :data="ruleForm.process_list" border>
                <el-table-column
                  prop="name"
                  label="进程名称"
                />
                <el-table-column
                  prop="alias"
                  label="进程别名"
                />
                <el-table-column
                  prop="bind_ip"
                  label="绑定IP"
                />
                <el-table-column
                  prop="port"
                  label="端口"
                />
                <el-table-column
                  prop="protocol"
                  label="协议"
                />
                <el-table-column label="操作" width="150px;">
                  <template slot-scope="scope">
                    <el-link
                      icon="el-icon-edit"
                      type="primary"
                      :underline="false"
                      @click="editProcessData(scope.row)"
                    >编辑</el-link>
                    <el-link
                      icon="el-icon-delete"
                      type="primary"
                      :underline="false"
                      style="margin-left: 15px;"
                      @click="deleteProcessData(scope.row.id)"
                    >删除</el-link>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <el-row style="margin-top: 30px; text-align: center;">
            <el-button @click="backtrack">返 回</el-button>
            <el-button type="primary" @click="submitForm">提 交</el-button>
          </el-row>
        </div>

        <!-- 新建/编辑 -->
        <el-drawer
          size="50%"
          :with-header="false"
          type="primary"
          :visible.sync="processDialog.dialog"
          direction="rtl"
          :wrapper-closable="false"
        >
          <div>
            <div class="el-drawer-new-sideslider-header">
              <div class="el-drawer-new-sideslider-closer" style="float: left;" @click="processDialog.dialog = false">
                <i
                  class="el-icon-arrow-right"
                />
              </div>
              <div class="el-drawer-new-sideslider-title" style="padding: 0px 0px 0px 50px;">
                新建服务模版
              </div>
              <div style="padding: 23px 20px 20px 20px;">
                <el-form
                  ref="processRuleForm"
                  label-position="top"
                  :model="processRuleForm"
                  :rules="rules"
                  label-width="100px"
                  class="create-process-dialog"
                >
                  <el-row>
                    <el-col :span="24"><div class="create-template-title">基础信息</div></el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="进程名称" prop="name">
                        <el-tooltip class="item" effect="dark" content="程序的二进制名称 比如zookeeper的二进制名称是java，则填java" placement="top">
                          <el-input v-model="processRuleForm.name" size="small" placeholder="请输入进程名称" />
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="进程别名" prop="alias">
                        <el-tooltip class="item" effect="dark" content="对外显示的服务名 比如程序的二进制名称为java的服务zookeeper，则填zookeeper" placement="top">
                          <el-input v-model="processRuleForm.alias" size="small" placeholder="请输入进程别名" />
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="进程启动参数">
                        <el-tooltip class="item" effect="dark" content="程序启动参数 用于唯一识别一个进程，例如 -cp zookeeper" placement="top">
                          <el-input
                            v-model="processRuleForm.start_params"
                            size="small"
                            type="textarea"
                            :rows="2"
                            placeholder="请输入进程启动参数"
                          />
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="备注">
                        <el-input
                          v-model="processRuleForm.remark"
                          size="small"
                          type="textarea"
                          :rows="2"
                          placeholder="请输入备注"
                        />
                      </el-form-item>
                    </el-col>

                    <el-col :span="24"><div class="create-template-title" style="margin-top: 13px; margin-bottom: 5px;">监听信息</div></el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="绑定IP">
                        <el-select v-model="processRuleForm.bind_ip" style="width: 100%" clearable placeholder="请选择" size="small">
                          <el-option label="127.0.0.1" value="127.0.0.1" />
                          <el-option label="0.0.0.0" value="0.0.0.0" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="端口">
                        <el-tooltip class="item" effect="dark" content="单个端口：8080 多个连续端口：8080-8089 多个不连续端口：8080-8089,8199" placement="top">
                          <el-input v-model="processRuleForm.port" size="small" placeholder="请输入端口" />
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="协议">
                        <el-input v-model="processRuleForm.protocol" size="small" placeholder="请输入协议" />
                      </el-form-item>
                    </el-col>

                    <el-col :span="24"><div class="create-template-title" style="margin-top: 13px; margin-bottom: 5px;">进程管理信息</div></el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="工作路径">
                        <el-input v-model="processRuleForm.work_path" size="small" placeholder="请输入工作路径" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="启动用户">
                        <el-input v-model="processRuleForm.start_user" size="small" placeholder="请输入启动用户" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="启动数量">
                        <el-input-number v-model="processRuleForm.start_number" :min="1" size="small" style="width: 60%" placeholder="请输入启动数量" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="启动优先级">
                        <el-input-number v-model="processRuleForm.start_priority" :min="1" size="small" style="width: 60%" placeholder="请输入启动优先级" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="启动命令">
                        <el-input v-model="processRuleForm.start_command" size="small" type="textarea" :rows="2" placeholder="请输入启动命令" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="停止命令">
                        <el-input v-model="processRuleForm.stop_command" size="small" type="textarea" :rows="2" placeholder="请输入停止命令" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="重启命令">
                        <el-input v-model="processRuleForm.restart_command" size="small" type="textarea" :rows="2" placeholder="请输入重启命令" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="强制停止命令">
                        <el-input v-model="processRuleForm.force_stop_command" size="small" type="textarea" :rows="2" placeholder="请输入强制停止命令" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="重载命令">
                        <el-input v-model="processRuleForm.reload_command" size="small" type="textarea" :rows="2" placeholder="请输入重载命令" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="PID文件路径">
                        <el-input v-model="processRuleForm.pid_path" size="small" type="textarea" :rows="2" placeholder="请输入PID文件路径" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="启动超时时长(秒)">
                        <el-input-number v-model="processRuleForm.start_timeout" :min="1" size="small" style="width: 60%" placeholder="请输入启动超时时长" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="重启间隔时间(秒)">
                        <el-input-number v-model="processRuleForm.restart_interval" :min="1" size="small" style="width: 60%" placeholder="请输入重启间隔时间" />
                      </el-form-item>
                    </el-col>

                    <el-col :span="24"><div class="create-template-title" style="margin-top: 13px; margin-bottom: 5px;">外网代理信息</div></el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="网关IP">
                        <el-input v-model="processRuleForm.gateway_ip" size="small" placeholder="请输入网关IP" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="网关端口">
                        <el-tooltip class="item" effect="dark" content="单个端口：8080 多个连续端口：8080-8089 多个不连续端口：8080-8089,8199" placement="top">
                          <el-input v-model="processRuleForm.gateway_port" size="small" placeholder="请输入网关端口" />
                        </el-tooltip>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 30px">
                      <el-form-item label="网关协议">
                        <el-select v-model="processRuleForm.gateway_protocol" style="width: 100%" size="small" placeholder="请选择网关协议">
                          <el-option label="TCP" value="TCP" />
                          <el-option label="UDP" value="UDP" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <div style="text-align: center; padding-bottom: 30px; padding-top: 20px;">
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="processDialog.dialog = false">取 消</el-button>
                    <el-button type="primary" @click="submitProcessForm">确 定</el-button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </el-drawer>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  serviceClassifyList,
  createSvcTpl,
  svcTplDetails,
  createSvcTplProcess,
  editSvcTplProcess,
  deleteSvcTplProcess
} from '@/api/cmdb/business'
export default {
  components: {
  },
  data() {
    return {
      loading: false,
      processList: [],
      status: '',
      ruleForm: {},
      sclist: [],
      processDialog: {},
      processRuleForm: {},
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        alias: [{ required: true, message: '必填', trigger: 'blur' }],
        svc_classify: [{ required: true, message: '必选', trigger: 'change' }]
      }
    }
  },
  created() {
    this.status = this.$route.query.status
    if (this.status !== undefined && this.status !== null && this.status === 'edit') {
      this.getDetails()
    }
    this.getSvcClassifyList()
  },
  methods: {
    getDetails() {
      this.loading = true
      svcTplDetails(this.$route.query.id).then(res => {
        this.ruleForm = res.data
        this.loading = false
      })
    },
    getSvcClassifyList() {
      serviceClassifyList().then(res => {
        this.sclist = res.data
      })
    },
    createProcessData() {
      this.processRuleForm = {}
      this.processDialog = {
        title: '新建进程',
        status: 'create',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.processRuleForm.clearValidate()
      })
    },
    editProcessData(row) {
      this.processRuleForm = row
      this.processDialog = {
        title: '编辑进程',
        status: 'edit',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.processRuleForm.clearValidate()
      })
    },
    deleteProcessData(id) {
      this.$confirm('是否删除此进程?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteSvcTplProcess(id).then(() => {
          this.getDetails()
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
    submitProcessForm() {
      this.$refs.processRuleForm.validate((valid) => {
        if (valid) {
          if (this.processDialog.status === 'create') {
            if (this.status === undefined || this.status === null || this.status === 'create') {
              var process = JSON.parse(JSON.stringify(this.processRuleForm))
              if (this.ruleForm.process_list === undefined || this.ruleForm.process_list === null || this.ruleForm.process_list.length === 0) {
                this.ruleForm.process_list = [process]
              } else {
                this.ruleForm.process_list.push(process)
              }
            } else if (this.status === 'edit') {
              // 直接新增进程数据
              this.processRuleForm.svc_tpl = parseInt(this.$route.query.id)
              createSvcTplProcess(this.processRuleForm).then(() => {
                this.getDetails()
                this.$message({
                  type: 'success',
                  message: '新建进程成功'
                })
              })
            }
          } else if (this.processDialog.status === 'edit') {
            delete this.processRuleForm.created_at
            delete this.processRuleForm.updated_at
            editSvcTplProcess(this.processRuleForm.id, this.processRuleForm).then(() => {
              this.getDetails()
              this.$message({
                type: 'success',
                message: '编辑进程成功'
              })
            })
          }
          this.processDialog.dialog = false
        }
      })
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.status === undefined || this.status === null || this.status === 'create') {
            createSvcTpl(this.ruleForm).then(res => {
              this.$router.push({ path: '/cmdb/business/service-template' })
            })
          } else if (this.status === 'edit') {
            console.log(1)
          }
        }
      })
    },
    backtrack() {
      this.$router.push({ path: '/cmdb/business/service-template' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .create-template-title {
    color: #63656e;
    font-size: 16px;
    padding-bottom: 20px;
    font-weight: 700;
  }

  /deep/ .create-process-dialog .el-form-item__label {
    padding: 0;
    line-height: 25px;
  }

  /deep/ .create-process-dialog .el-form-item {
    margin-bottom: 15px;
  }

  .model-info-div {
    display: inline-block;
    height: 45px;
    line-height: 45px;
  }

  .model-field-div {
    width: calc(20% - 10px);
    height: 59px;
    border: 1px solid rgb(221, 228, 235);;
    border-radius: 4px;
    margin-left: 10px;
    margin-top: 12px;
    padding-top: 9px;
    cursor: pointer;
    display: inline-block;
  }

  .model-field-title {
    margin: 11px 15px 0 15px;
    line-height: 19px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .model-field-remarks {
    line-height: 16px;
    font-size: 12px;
    color: #bfc7d2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 15px;
  }

  .model-field-add {
    line-height: 59px;
    text-align: center;
    font-size: 14px;
    border-style: dashed;
  }

  .model-field-div:hover {
    border-color: #1890ff;
  }

  .model-field-settings {
    background-color: rgb(243, 248, 255);
    margin-bottom: 22px;
    padding: 15px;
    color: #606266;
    font-size: 14px;
    font-weight: 700;
  }

  .group-operate-icon {
    font-size: 15px;
    margin-left: 10px;
    cursor: pointer;
  }
</style>
