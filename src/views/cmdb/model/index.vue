<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 提示 -->
        <div style="margin-bottom: 15px;">
          <el-alert
            style="background: #F0F8FF; color: #63656E"
            title="模型可以查看并动态更改CMDB当前的数据结构，例如新增了一种设备需要通过记录到CMDB，可以通过新建对应的模型实现。"
            type="info"
            show-icon
          />
        </div>
        <!-- 操作 -->
        <div>
          <el-row>
            <el-button size="mini" type="primary" @click="createModelHandle(undefined)">新建模型</el-button>
            <el-button size="mini" @click="createModelGroupHandle">新建分组</el-button>
            <el-input
              v-model="query.search"
              size="mini"
              placeholder="请输入内容"
              class="input-with-select"
              style="width: 300px; margin-left: 10px"
              @keyup.enter.native="getList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getList" />
            </el-input>
            <el-radio-group v-model="isUsable" size="mini" style="margin-left: 10px" @change="getList">
              <el-radio-button label="启用中" />
              <el-radio-button label="已停用" />
            </el-radio-group>
          </el-row>
        </div>
        <!-- 模型列表 -->
        <div>
          <div v-for="group of groupModelList" :key="group.id" style="margin-top: 23px;">
            <!-- 模型分组名称 -->
            <div style="font-size: 16px;">
              <span class="group-title-before" />
              <span style="color: rgb(51, 57, 72);">{{ group.name }} </span>
              <span style="color: rgb(195, 205, 215);"> ( {{ group.model_list === null ? 0 : group.model_list.length }} )</span>
              <i
                class="el-icon-circle-plus-outline group-operate-icon"
                style="font-size: 16px;"
                @click="createModelHandle(group.id)"
              />
              <i
                class="el-icon-edit group-operate-icon"
                @click="editModelGroupHandle(group.id, group.identifies, group.name)"
              />
              <template v-if="group.model_list === null || group.model_list === undefined || group.model_list.length === 0">
                <i
                  v-if="isUsable==='启用中'"
                  class="el-icon-delete group-operate-icon"
                  @click="deleteModelGroupHandle(group.id)"
                />
              </template>

            </div>
            <!-- 模型列表 -->
            <div v-if="group.model_list !== null && group.model_list !== undefined && group.model_list.length !== 0">
              <div v-for="model of group.model_list" :key="model.id" class="model-info-div" @click="modelConfigureField(model.id)">
                <!-- 模型图标 -->
                <div class="model-info-icon">
                  <i :class="model.icon" />
                </div>
                <!-- 模型详情 -->
                <div>
                  <div class="model-info-details-title">{{ model.name }}</div>
                  <div class="model-info-details-remarks">{{ model.identifies }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 创建/编辑模型分组 -->
      <el-dialog
        :title="modelGroupDesc.title"
        :visible.sync="modelGroupDesc.dialog"
        width="30%"
      >
        <el-form ref="groupRuleForm" :model="groupRuleForm" :rules="rules" label-width="100px">
          <el-form-item label="唯一标识" prop="identifies">
            <el-tooltip class="item" effect="dark" content="请以英文开头，且仅支持输入英文、数字及下划线" placement="top-start">
              <el-input v-model="groupRuleForm.identifies" placeholder="请输入唯一标识" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="groupRuleForm.name" placeholder="请输入名称" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitGroupForm">提交</el-button>
        </div>
      </el-dialog>

      <!-- 创建/编辑模型 -->
      <el-dialog
        :title="modelDesc.title"
        :visible.sync="modelDesc.dialog"
        width="38%"
      >
        <el-form ref="modelRuleForm" :model="modelRuleForm" :rules="rules" label-width="100px">
          <el-form-item label="唯一标识" prop="identifies">
            <el-tooltip class="item" effect="dark" content="请以英文开头，且仅支持输入英文、数字及下划线" placement="top-start">
              <el-input v-model="modelRuleForm.identifies" placeholder="请输入唯一标识" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="modelRuleForm.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <e-icon-picker v-model="modelRuleForm.icon" />
          </el-form-item>
          <el-form-item label="所属分组" prop="group_id">
            <el-select v-model="modelRuleForm.group_id" placeholder="请选择所属分组" style="width: 100%">
              <el-option
                v-for="group of groupModelList"
                :key="group.id"
                :label="group.name"
                :value="group.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitModelForm">提交</el-button>
        </div>
      </el-dialog>
    </template>
  </BasicLayout>
</template>

<script>
import {
  createModelGroup,
  modelList,
  editModelGroup,
  deleteModelGroup,
  createModelInfo
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
        callback(new Error('必须是英文开头，仅包含英文、数字及下划线'))
      }
    }
    return {
      isUsable: '启用中',
      query: {},
      groupModelList: [],
      modelGroupDesc: {
        title: '新建分组',
        status: 'create',
        dialog: false
      },
      modelDesc: {
        title: '新建模型',
        status: 'create',
        dialog: false
      },
      groupRuleForm: {},
      modelRuleForm: {},
      rules: {
        identifies: [
          { required: true, message: '请输入唯一标识', trigger: 'blur' },
          { validator: validateIdentifies, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '请选择图标', trigger: 'change' }
        ],
        group_id: [
          { required: true, message: '请选择所属分组', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.$nextTick(() => {
      this.iconStatus = true
    })
  },
  methods: {
    getList() {
      this.formatIsUsable()
      modelList(this.query).then(res => {
        this.groupModelList = res.data
      })
    },
    formatIsUsable() {
      if (this.isUsable === '启用中') {
        this.query.isUsable = 1
      } else {
        this.query.isUsable = 0
      }
    },
    modelConfigureField(modelId) {
      this.$router.push({ path: '/cmdb/model/model-fields', query: { 'modelId': modelId }})
    },
    createModelGroupHandle() {
      this.groupRuleForm = {}
      this.modelGroupDesc = {
        title: '新建分组',
        status: 'create',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.groupRuleForm.clearValidate()
      })
    },
    editModelGroupHandle(groupId, identifies, name) {
      this.groupRuleForm = {
        id: groupId,
        identifies: identifies,
        name: name
      }
      this.modelGroupDesc = {
        title: '编辑分组',
        status: 'edit',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.groupRuleForm.clearValidate()
      })
    },
    submitGroupForm() {
      this.$refs['groupRuleForm'].validate((valid) => {
        if (valid) {
          if (this.modelGroupDesc.status === 'create') {
            createModelGroup(this.groupRuleForm).then(res => {
              this.getList()
              this.modelGroupDesc.dialog = false
              this.$message({
                type: 'success',
                message: '创建分组成功'
              })
            })
          } else if (this.modelGroupDesc.status === 'edit') {
            editModelGroup(this.groupRuleForm.id, this.groupRuleForm).then(res => {
              this.getList()
              this.modelGroupDesc.dialog = false
              this.$message({
                type: 'success',
                message: '编辑分组成功'
              })
            })
          }
        }
      })
    },
    createModelHandle(groupId) {
      this.modelRuleForm = {}
      if (groupId !== undefined) {
        this.modelRuleForm.group_id = groupId
      }
      this.modelDesc = {
        title: '新建模型',
        status: 'create',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.modelRuleForm.clearValidate()
      })
    },
    submitModelForm() {
      this.$refs['modelRuleForm'].validate((valid) => {
        if (valid) {
          createModelInfo(this.modelRuleForm).then(res => {
            this.getList()
            this.modelDesc.dialog = false
            this.$confirm('是否立即去配置模型字段?', '成功', {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'success',
              center: true
            }).then(() => {
              // 跳转到模型详情页面
              this.$router.push({ path: '/cmdb/model/model-fields', query: { 'modelId': res.data.id }})
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          })
        }
      })
    },
    deleteModelGroupHandle(groupId) {
      this.$confirm('是否删除模型分组？', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteModelGroup(groupId).then(res => {
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
    }
  }
}
</script>

<style scoped>
  .group-title-before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 14px;
    vertical-align: middle;
    margin: 0px 10px 0px 0px;
    background: rgb(195, 205, 215);
  }

  .model-info-div {
    width: calc(20% - 14px);
    height: 70px;
    border: 1px solid rgb(221, 228, 235);;
    border-radius: 4px;
    margin-left: 14px;
    margin-top: 12px;
    cursor: pointer;
    display: inline-block;
  }

  .model-info-icon {
    float: left;
    width: 66px;
    text-align: center;
    font-size: 32px;
    color: #3a84ff;
    line-height: 68px;
  }

  .model-info-details-title {
    margin-top: 16px;
    line-height: 19px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .model-info-details-remarks {
    line-height: 16px;
    font-size: 12px;
    color: #bfc7d2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .group-operate-icon {
    margin-left: 10px;
    font-size: 15px;
    color: rgb(51, 57, 72);
    cursor: pointer;
  }
</style>
