<template>
  <BasicLayout>
    <template #wrapper>
      <!-- 模型信息 -->
      <el-card class="box-card">
        <div style="float: left;height: 65px">
          <i
            style="font-size: 45px; margin-right: 20px; color: #3a84ff;"
            :class="modelDetail.icon"
          />
        </div>
        <div style="font-size: 14px; float: left;" class="model-info-div">
          <span style="color: #737987;">唯一标识：</span>{{ modelDetail.identifies }}
          <span style="color: #737987; margin-left: 10px;">名称：</span>{{ modelDetail.name }}
          <span style="color: #737987; margin-left: 10px;">状态：</span>{{ modelDetail.is_usable ? '已启用' : '已停用' }}
          <span style="color: #737987; margin-left: 10px;">实例数量：</span>
          <span style="color: #1890ff">
            <router-link to="/">
              1 <i class="el-icon-s-promotion" />
            </router-link>
          </span>
        </div>
        <div class="model-info-div" style="float: right;">
          <el-link
            style="margin-left: 10px;"
            :underline="false"
            icon="el-icon-edit"
            type="primary"
            @click="editModelInfoHandle({
              id: modelDetail.id,
              identifies: modelDetail.identifies,
              name: modelDetail.name,
              icon: modelDetail.icon,
              group_id: modelDetail.group_id,
            })"
          >编辑</el-link>
          <el-link
            style="margin-left: 10px;"
            :underline="false"
            icon="el-icon-remove-outline"
            type="primary"
            @click="stopModelHandle(modelDetail.is_usable)"
          >
            {{ modelDetail.is_usable ? '停用' : '启用' }}
          </el-link>
          <el-tooltip class="item" effect="dark" content="字段分组不存在的情况下，才可删除模型" placement="top-end">
            <el-link
              style="margin-left: 10px;"
              :underline="false"
              icon="el-icon-delete"
              type="primary"
              :disabled="modelDetail.field_groups !== undefined &&
                modelDetail.field_groups !== null &&
                modelDetail.field_groups.length > 0?true:false"
            >
              删除
            </el-link>
          </el-tooltip>
        </div>
      </el-card>

      <el-tabs v-model="activeName" type="border-card" style="margin-top: 8px" @tab-click="handleClick">
        <el-tab-pane label="模型字段" name="1">
          <div>
            <el-button plain size="small" @click="previewField">字段预览</el-button>
            <!-- 字段分组列表 -->
            <template v-if="modelDetail.field_groups !== undefined && modelDetail.field_groups !== null && modelDetail.field_groups.length > 0">
              <div v-for="fieldGroup of modelDetail.field_groups" :key="fieldGroup.id" style="margin-top: 25px">
                <div>
                  <el-link
                    style="font-size: 16px;"
                    :underline="false"
                    icon="el-icon-arrow-right"
                  >
                    {{ fieldGroup.name }}
                    <i
                      class="el-icon-edit group-operate-icon"
                      @click="editFieldGroupHandle(fieldGroup)"
                    />
                    <i
                      v-if="fieldGroup.fields === undefined || fieldGroup.fields === null || fieldGroup.fields.length === 0"
                      class="el-icon-delete group-operate-icon"
                      @click="deleteFieldGroupHandle(fieldGroup.id)"
                    />
                  </el-link>
                  <!-- 字段列表 -->
                  <div>
                    <el-collapse-transition>
                      <div>
                        <template v-if="fieldGroup.fields !== undefined && fieldGroup.fields !== null && fieldGroup.fields.length > 0">
                          <div v-for="field of fieldGroup.fields" :key="field.id" class="model-field-div" @click="editFieldHandle(field)">
                            <!-- 字段详情 -->
                            <span class="model-field-title">{{ field.name }}</span><br>
                            <span class="model-field-remarks">{{ getFieldTypeLabel(field.type) }}</span>
                          </div>
                        </template>
                        <div class="model-field-div" style="text-align: center" @click="createFieldHandle(fieldGroup.id)">
                          <span class="model-field-title" style="color: #979ba5">
                            <i class="el-icon-plus" />
                            添加
                          </span><br>
                          <span class="model-field-remarks">点击此处新增字段</span>
                        </div>
                      </div>
                    </el-collapse-transition>
                  </div>
                </div>
              </div>
            </template>
            <div>
              <el-link
                style="font-size: 16px; margin-top: 20px;"
                type="primary"
                :underline="false"
                icon="el-icon-circle-plus-outline"
                @click="createFieldGroupHandle"
              >
                添加分组
              </el-link>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="模型关联" name="2">模型关联</el-tab-pane>
        <el-tab-pane label="唯一校验" name="3">
          <uniqueFields ref="uniqueFields" :model-id="modelId" :fields="modelDetail.field_groups" />
        </el-tab-pane>
      </el-tabs>

      <!-- 添加/编辑分组 -->
      <el-dialog
        :title="fieldGroupDesc.title"
        :visible.sync="fieldGroupDesc.dialog"
        width="30%"
      >
        <el-form ref="fieldGroupForm" :model="fieldGroupForm" :rules="rules" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="fieldGroupForm.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="是否折叠">
            <el-switch
              v-model="fieldGroupForm.is_fold"
            />
          </el-form-item>
          <el-form-item label="展示顺序" prop="sequence">
            <el-input-number v-model="fieldGroupForm.sequence" :min="1" :max="999" label="展示顺序" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fieldGroupDesc.dialog = false">取 消</el-button>
          <el-button type="primary" @click="CreateFieldGroupSubmitForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 创建/编辑字段 -->
      <el-drawer
        size="38%"
        :with-header="false"
        type="primary"
        :visible.sync="fieldDesc.dialog"
        direction="rtl"
        :wrapper-closable="false"
      >
        <div v-if="fieldDesc.dialog">
          <div class="model-field-sideslider-header">
            <div class="model-field-sideslider-closer" style="float: left;">
              <i
                class="el-icon-arrow-right"
              />
            </div>
            <div class="model-field-sideslider-title" style="padding: 0px 0px 0px 50px;">
              {{ fieldDesc.title }}
            </div>
          </div>
          <div class="model-field-slider-content">
            <el-form ref="createFieldForm" :model="createFieldForm" :rules="rules" label-width="78px">
              <el-form-item label="唯一标识" prop="identifies">
                <el-tooltip class="item" effect="dark" content="请以英文开头，且仅支持输入英文、数字及下划线" placement="top-start">
                  <el-input
                    v-model="createFieldForm.identifies"
                    placeholder="请输入唯一标识"
                  />
                </el-tooltip>
              </el-form-item>
              <el-form-item label="字段名称" prop="name">
                <el-input v-model="createFieldForm.name" placeholder="请输入字段名称" />
              </el-form-item>
              <el-form-item label="字段类型" prop="type">
                <el-select v-model="createFieldForm.type" style="width: 100%" filterable placeholder="请选择字段类型">
                  <el-option
                    v-for="item in fieldTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="用户提示">
                <el-input v-model="createFieldForm.prompt" type="textarea" />
              </el-form-item>
              <div class="model-field-settings">
                <div style="margin-bottom: 15px;">字段设置</div>
                <div>
                  <el-checkbox v-model="createFieldForm.configuration.is_edit">可编辑</el-checkbox>
                  <el-checkbox v-model="createFieldForm.is_unique">是否唯一</el-checkbox>
                  <el-checkbox v-model="createFieldForm.required">是否必须</el-checkbox>
                </div>
                <!-- 正则表达式 -->
                <div
                  v-if="createFieldForm.type === 'string'"
                  style="margin-top: 20px"
                >
                  <span>正则验证</span><br>
                  <el-input
                    v-model="createFieldForm.configuration.regular"
                    style="margin-top: 5px"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入正则表达式"
                  />
                </div>
                <!-- 最大 -->
                <div
                  v-if="createFieldForm.type === 'number'"
                  style="margin-top: 20px"
                >
                  <span>最小值</span><br>
                  <el-input-number
                    v-model="createFieldForm.configuration.min_number"
                    :min="1"
                    style="margin-top: 5px"
                  />
                </div>
                <!-- 最小 -->
                <div
                  v-if="createFieldForm.type === 'number'"
                  style="margin-top: 20px"
                >
                  <span>最大值</span><br>
                  <el-input-number
                    v-model="createFieldForm.configuration.max_number"
                    :min="10"
                    style="margin-top: 5px"
                  />
                </div>
                <!-- 枚举 -->
                <div v-if="createFieldForm.type === 'enum'" style="margin-top: 20px">
                  <div>
                    <span>枚举值</span><br>
                    <div v-for="(enumItem, enumIndex) in createFieldForm.configuration.enum_list" :key="enumIndex" style="margin-top: 5px;">
                      <div style="width: calc(100% - 60px); display: inline-block;">
                        <div style="width: 30%; display: inline-block;">
                          <el-input v-model="createFieldForm.configuration.enum_list[enumIndex].uuid" placeholder="请输入ID" />
                        </div>
                        <div style="width: 50px; width: 70%; padding-left: 5px; display: inline-block;">
                          <el-input v-model="createFieldForm.configuration.enum_list[enumIndex].value" placeholder="请输入值" />
                        </div>
                      </div>
                      <div style="width: 60px; height: 38px; line-height: 38px; font-size: 23px; display: inline-block;">
                        <i
                          :style="enumIndex === 0 ? {'display': 'none'}: {}"
                          class="el-icon-remove-outline"
                          style="margin-left: 5px; cursor: pointer;"
                          @click="deleteEnumValue(enumIndex)"
                        />
                        <i class="el-icon-circle-plus-outline" style="margin-left: 5px; cursor: pointer;" @click="addEnumValue" />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="createFieldForm.type === 'list'" style="margin-top: 20px">
                  <div>
                    <span>列表值</span><br>
                    <div
                      v-for="(listItem, listIndex) in createFieldForm.configuration.list_value"
                      :key="listIndex"
                      style="margin-top: 5px;"
                    >
                      <div style="width: calc(100% - 60px); display: inline-block;">
                        <div style="width: 100%;">
                          <el-input v-model="createFieldForm.configuration.list_value[listIndex].value" placeholder="请输入值" />
                        </div>
                      </div>
                      <div style="width: 60px; height: 38px; line-height: 38px; font-size: 23px; display: inline-block;">
                        <i
                          class="el-icon-remove-outline"
                          style="margin-left: 5px; cursor: pointer;"
                          :style="listIndex === 0 ? {'display': 'none'}: {}"
                          @click="deleteListValue(listIndex)"
                        />
                        <i class="el-icon-circle-plus-outline" style="margin-left: 5px; cursor: pointer;" @click="addListValue" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
            <div style="text-align: center; margin-top: 30px;">
              <el-button v-if="fieldDesc.status === 'edit'" type="danger" @click="deleteModelFieldHandle(createFieldForm.id)">删 除</el-button>
              <el-button @click="fieldDesc.dialog = false">取 消</el-button>
              <el-button type="primary" @click="createFieldSubmit">提 交</el-button>
            </div>
          </div>
        </div>
      </el-drawer>

      <!-- 字段预览 -->
      <el-drawer
        size="36%"
        :with-header="false"
        type="primary"
        :visible.sync="fieldPreviewDesc.dialog"
        direction="rtl"
        :wrapper-closable="false"
      >
        <div>
          <div class="model-field-sideslider-header">
            <div class="model-field-sideslider-closer" style="float: left;">
              <i
                class="el-icon-arrow-right"
              />
            </div>
            <div class="model-field-sideslider-title" style="padding: 0px 0px 0px 50px;">
              {{ fieldPreviewDesc.title }}
            </div>
            <div>
              <renderModel v-if="renderModelStatus" :fields="modelDetail.field_groups" />
            </div>
          </div>
        </div>
      </el-drawer>

      <!-- 编辑模型 -->
      <el-dialog
        title="编辑模型"
        :visible.sync="modelDialog"
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
  createModelFieldGroup,
  modelDetails,
  createModelField,
  editModelField,
  deleteFieldGroup,
  editFieldGroup,
  getModelGroupList,
  editModelInfo,
  stopModelInfo,
  deleteModelField
} from '@/api/cmdb/model'

import renderModel from './components/render-model'
import uniqueFields from './components/unique-fields'

export default {
  components: {
    renderModel,
    uniqueFields
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
      renderModelStatus: false,
      groupModelList: [],
      modelRuleForm: {},
      modelDialog: false,
      modelDetail: {},
      activeName: '1',
      fieldDesc: {},
      fieldPreviewDesc: {},
      fieldGroupDesc: {},
      fieldGroupForm: {},
      fieldForm: {},
      formLabelWidth: '80px',
      modelId: 0,
      createFieldForm: {
        configuration: {
          is_edit: true,
          list_value: [{
            value: ''
          }],
          enum_list: [{
            uuid: '',
            value: ''
          }]
        },
        type: 'string'
      },
      fieldTypeOptions: [
        { label: '字符', value: 'string' },
        { label: '数字', value: 'number' },
        { label: '枚举', value: 'enum' },
        { label: '列表', value: 'list' },
        { label: '日期', value: 'date' },
        { label: '时间', value: 'time' },
        { label: '布尔', value: 'bool' },
        { label: '用户', value: 'user' }
        // { label: '部门', value: 'depart' }
      ],
      rules: {
        identifies: [
          { required: true, message: '请输入唯一标识', trigger: 'blur' },
          { validator: validateIdentifies, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入字段名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择字段类型', trigger: 'change' }
        ]
      },
      tableUniqueData: []
    }
  },
  created() {
    this.modelId = this.$route.query.modelId
    this.getInfo()
    this.getModelGroupListHandle()
  },
  methods: {
    // 获取数据
    getInfo() {
      if (this.modelId > 0) {
        modelDetails(this.modelId).then(res => {
          this.modelDetail = res.data
        })
      } else {
        this.$message({
          type: 'error',
          message: '请确认有没有modelId这个参数',
          duration: 2000,
          onClose: () => {
            this.$router.push({ 'path': '/cmdb/model/index' })
          }
        })
      }
    },
    deleteModelFieldHandle(fieldId) {
      this.$confirm('是否删除此字段?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteModelField(fieldId).then(res => {
          this.getInfo()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fieldDesc.dialog = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    previewField() {
      this.renderModelStatus = true
      this.fieldPreviewDesc = {
        dialog: true,
        title: '字段预览'
      }
    },
    getModelGroupListHandle() {
      getModelGroupList().then(res => {
        this.groupModelList = res.data
      })
    },
    editModelInfoHandle(modelInfo) {
      this.modelRuleForm = modelInfo
      this.modelDialog = true
    },
    submitModelForm() {
      this.$refs['modelRuleForm'].validate((valid) => {
        if (valid) {
          editModelInfo(this.modelRuleForm.id, this.modelRuleForm).then(res => {
            this.getInfo()
            this.modelDialog = false
          })
        }
      })
    },
    getFieldTypeLabel(value) {
      for (var option of this.fieldTypeOptions) {
        if (value === option.value) {
          return option.label
        }
      }
    },
    // 停用
    stopModelHandle(status) {
      var isUsable = true
      var statusName = '停用'
      var iconName = 'warning'
      if (!status) {
        isUsable = true
        statusName = '启用'
        iconName = 'info'
      } else {
        isUsable = false
        statusName = '停用'
        iconName = 'warning'
      }
      this.$confirm(`是否${statusName}此模型?`, '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: iconName
      }).then(() => {
        stopModelInfo(this.modelId, {
          is_usable: isUsable
        }).then(res => {
          this.getInfo()
          this.$message({
            type: 'success',
            message: `${statusName}成功!`
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    deleteFieldGroupHandle(fieldGroupId) {
      this.$confirm('是否删除字段分组?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteFieldGroup(fieldGroupId).then(res => {
          this.getInfo()
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
    handleClick(tab, event) {
      if (this.activeName === '3') {
        this.$refs.uniqueFields.getUniqueFieldsHandle()
      }
    },
    editFieldGroupHandle(fieldGroup) {
      this.fieldGroupDesc = {
        title: '编辑字段分组',
        status: 'edit',
        dialog: true
      }
      this.fieldGroupForm = fieldGroup
      this.$nextTick(() => {
        this.$refs.fieldGroupForm.clearValidate()
      })
    },
    createFieldGroupHandle() {
      this.fieldGroupForm = {}
      this.fieldGroupDesc = {
        title: '创建字段分组',
        status: 'create',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.fieldGroupForm.clearValidate()
      })
    },
    CreateFieldGroupSubmitForm(formName) {
      this.$refs['fieldGroupForm'].validate((valid) => {
        if (valid) {
          if (this.fieldGroupDesc.status === 'create') {
            this.fieldGroupForm.info_id = parseInt(this.modelId)
            createModelFieldGroup(this.fieldGroupForm).then(res => {
              this.$message({
                type: 'success',
                message: '创建字段分组成功'
              })
            })
          } else if (this.fieldGroupDesc.status === 'edit') {
            editFieldGroup(this.fieldGroupForm.id, this.fieldGroupForm).then(res => {
              this.$message({
                type: 'success',
                message: '编辑字段分组成功'
              })
            })
          }
          this.getInfo()
          this.fieldGroupDesc.dialog = false
        }
      })
    },
    resetFieldForm() {
      this.createFieldForm = {
        configuration: {
          is_edit: true,
          list_value: [{
            value: ''
          }],
          enum_list: [{
            uuid: '',
            value: ''
          }]
        },
        type: 'string'
      }
    },
    createFieldHandle(fieldGroupId) {
      this.resetFieldForm()
      this.createFieldForm.field_group_id = fieldGroupId
      this.fieldDesc = {
        title: '新建字段',
        dialog: true,
        status: 'create'
      }
      this.$nextTick(() => {
        this.$refs.createFieldForm.clearValidate()
      })
    },
    editFieldHandle(field) {
      this.createFieldForm = field
      this.fieldDesc = {
        title: '编辑字段',
        dialog: true,
        status: 'edit'
      }
      this.$nextTick(() => {
        this.$refs.createFieldForm.clearValidate()
      })
    },
    createFieldSubmit() {
      this.$refs['createFieldForm'].validate((valid) => {
        if (valid) {
          if (this.fieldDesc.status === 'create') {
            this.createFieldForm.info_id = parseInt(this.modelId)
            createModelField(this.createFieldForm).then(res => {
              this.getInfo()
              this.$message({
                type: 'success',
                message: '创建字段成功'
              })
            })
          } else if (this.fieldDesc.status === 'edit') {
            editModelField(this.createFieldForm.id, this.createFieldForm).then(res => {
              this.getInfo()
              this.$message({
                type: 'success',
                message: '更新字段成功'
              })
            })
          }
          this.renderModelStatus = false
          this.fieldDesc.dialog = false
        }
      })
    },
    addEnumValue() {
      this.createFieldForm.configuration.enum_list.push({
        uuid: '',
        value: ''
      })
    },
    addListValue() {
      this.createFieldForm.configuration.list_value.push({
        value: ''
      })
    },
    deleteEnumValue(index) {
      this.createFieldForm.configuration.enum_list.splice(index, 1)
    },
    deleteListValue(index) {
      this.createFieldForm.configuration.list_value.splice(index, 1)
    }
  }
}
</script>

<style scoped>
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

  .model-field-sideslider-header {
    width: 100%;
    height: 60px;
    background: rgb(255, 255, 255);
  }

  .model-field-sideslider-closer {
    width: 30px;
    height: 60px;
    line-height: 60px;
    background-color: rgb(58, 132, 255);
    text-align: center;
    color: rgb(255, 255, 255);
    cursor: pointer;
    font-size: 24px;
  }

  .model-field-sideslider-title {
    height: 60px;
    line-height: 60px;
    font-size: 16px;
    font-weight: 700;
    color: rgb(102, 102, 102);
    border-bottom: 1px solid rgb(220, 222, 229);
  }

  .model-field-slider-content {
    padding: 20px;
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
