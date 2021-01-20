<template>
  <BasicLayout>
    <template #wrapper>
      <!-- 模型信息 -->
      <el-card class="box-card">
        <div style="float: left;height: 65px">
          <i
            style="font-size: 45px; margin-right: 20px; color: #3a84ff;"
            class="el-icon-info"
          />
        </div>
        <div style="font-size: 14px; float: left;" class="model-info-div">
          <span style="color: #737987;">唯一标识：</span>{{ modelDetails.identifies }}
          <span style="color: #737987; margin-left: 10px;">名称：</span>{{ modelDetails.name }}
          <span style="color: #737987; margin-left: 10px;">实例数量：</span>
          <span style="color: #1890ff">
            <router-link to="/">
              1 <i class="el-icon-s-promotion" />
            </router-link>
          </span>
        </div>
        <div class="model-info-div" style="float: right;">
          <el-link style="margin-left: 10px;" :underline="false" icon="el-icon-edit" type="primary">编辑</el-link>
          <el-link style="margin-left: 10px;" :underline="false" icon="el-icon-remove-outline" type="primary">停用</el-link>
          <el-link style="margin-left: 10px;" :underline="false" icon="el-icon-delete" type="primary">删除</el-link>
        </div>
      </el-card>

      <el-tabs v-model="activeName" type="border-card" style="margin-top: 8px" @tab-click="handleClick">
        <el-tab-pane label="模型字段" name="1">
          <div>
            <el-button plain size="small">字段预览</el-button>
            <!-- 字段分组列表 -->
            <template v-if="modelDetails.field_groups !== undefined && modelDetails.field_groups !== null && modelDetails.field_groups.length > 0">
              <div v-for="fieldGroup of modelDetails.field_groups" :key="fieldGroup.id" style="margin-top: 15px">
                <div>
                  <el-link
                    style="font-size: 16px;"
                    :underline="false"
                    icon="el-icon-arrow-right"
                    @click="groupFolding"
                  >{{ fieldGroup.name }}</el-link>
                  <!-- 字段列表 -->
                  <div>
                    <el-collapse-transition>
                      <div v-show="show3">
                        <template v-if="fieldGroup.fields !== undefined && fieldGroup.fields !== null && fieldGroup.fields.length > 0">
                          <div v-for="field of fieldGroup.fields" :key="field.id" class="model-field-div">
                            <!-- 字段详情 -->
                            <div class="model-field-title">{{ field.name }}</div>
                            <div class="model-field-remarks">{{ field.type }}</div>
                          </div>
                        </template>
                        <div class="model-field-div model-field-add" @click="createFieldHandle">
                          <div class="model-field-title" style="color: #979ba5">
                            <i class="el-icon-plus" />
                            添加
                          </div>
                          <div class="model-field-remarks">点击此处新增字段</div>
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
        <el-tab-pane label="唯一校验" name="3">唯一校验</el-tab-pane>
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
        :with-header="false"
        type="primary"
        :visible.sync="fieldDialog"
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
              新建字段
            </div>
          </div>
          <div class="model-field-slider-content">
            <el-form ref="createFieldForm" :model="createFieldForm" :rules="rules" label-width="78px">
              <el-form-item label="活动名称" prop="name">
                <el-input v-model="createFieldForm.name" />
              </el-form-item>
            </el-form>
            <div style="text-align: center; margin-top: 30px;">
              <el-button @click="fieldDialog = false">取 消</el-button>
              <el-button type="primary" @click="fieldDialog = false">提 交</el-button>
            </div>
          </div>
        </div>
      </el-drawer>
    </template>
  </BasicLayout>
</template>

<script>
import {
  createModelFieldGroup,
  modelDetails
} from '@/api/cmdb/model'
export default {
  components: {

  },
  data() {
    return {
      modelDetails: {},
      activeName: '1',
      show3: true,
      fieldDialog: false,
      fieldGroupDesc: {
        title: '创建分组',
        status: 'create',
        dialog: false
      },
      fieldGroupForm: {},
      fieldForm: {},
      formLabelWidth: '80px',
      modelId: 0,
      createFieldForm: {},
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sequence: [
          { required: true, message: '请输入顺序', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.modelId = this.$route.query.modelId
    this.getInfo()
  },
  methods: {
    // 获取数据
    getInfo() {
      if (this.modelId > 0) {
        modelDetails(this.modelId).then(res => {
          this.modelDetails = res.data
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
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    groupFolding() {
      if (this.show3 === true) {
        this.show3 = false
      } else {
        this.show3 = true
      }
    },
    createFieldGroupHandle() {
      this.fieldGroupDesc.dialog = true
    },
    CreateFieldGroupSubmitForm(formName) {
      this.$refs['fieldGroupForm'].validate((valid) => {
        if (valid) {
          this.fieldGroupForm.info_id = parseInt(this.modelId)
          createModelFieldGroup(this.fieldGroupForm).then(res => {
            this.getList()
          })
        }
      })
    },
    createFieldHandle() {
      this.fieldDialog = true
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
</style>
