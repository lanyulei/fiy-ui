<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ fields.name }}</span>
        </div>
        <!-- 操作 -->
        <div>
          <el-row>
            <div>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="createDataInfo">新建</el-button>
              <el-button size="mini" type="primary" icon="el-icon-finished" style="margin-left: 5px;" @click="distribution">资源分配</el-button>
              <el-button size="mini" type="primary" icon="el-icon-bottom-left" style="margin-left: 5px;" @click="importDialog = true">导入</el-button>
              <el-button :loading="exportLoading" size="mini" type="primary" icon="el-icon-top-right" style="margin-left: 5px;" @click="handleExportData">导出</el-button>
              <el-button size="mini" type="primary" icon="el-icon-search" style="margin-left: 5px;" @click="searchShow = !searchShow">筛选</el-button>
              <div style="margin: 20px 0 10px 0">
                <transition name="el-zoom-in-top">
                  <div v-if="searchShow" class="transition-box search-list" style="margin-top: 15px;">
                    <el-form label-width="55px">
                      <el-form-item label="类型：" class="el-form-item-content">
                        <el-radio-group v-model="queryParams.search_type">
                          <el-radio :label="1">与</el-radio>
                          <el-radio :label="2">或</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item class="el-form-item-content">
                        <el-radio-group v-model="queryParams.search_classiy">
                          <el-radio :label="1">精确</el-radio>
                          <el-radio :label="2">模糊</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item v-for="(searchItem, searchIndex) in search_list" :key="searchIndex" :label="searchIndex === 0 ? '条件：' : ''" class="el-form-item-content">
                        <el-input
                          v-model="search_list[searchIndex].value"
                          size="mini"
                          placeholder="请输入搜索内容"
                          class="input-with-select"
                          style="width: 500px;"
                          @keyup.enter.native="getList"
                        >
                          <el-select slot="prepend" v-model="search_list[searchIndex].identifies" placeholder="请选择" style="width: 95px">
                            <el-option v-for="fieldItem of fieldList" :key="fieldItem.id" :label="fieldItem.name" :value="fieldItem.identifies" />
                          </el-select>
                          <el-button v-if="searchIndex !== 0" slot="append" icon="el-icon-remove-outline" @click="delSearchContent(searchIndex)" />
                        </el-input>
                      </el-form-item>
                      <el-form-item class="el-form-item-button">
                        <el-button type="primary" size="mini" @click="getList">搜索</el-button>
                        <el-button type="success" size="mini" style="margin-left: 5px;" @click="addSearchContent">新增条件</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </transition>
              </div>
            </div>
          </el-row>
        </div>
        <!-- 模型列表 -->
        <div style="margin-top: 15px;">
          <el-table v-loading="loading" :data="list" border @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55"
            />
            <template v-for="field of fieldList">
              <el-table-column
                v-if="field.is_list_display"
                :key="field.id"
                :prop="field.identifies"
                :label="field.name"
              />
            </template>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-link
                  icon="el-icon-view"
                  type="primary"
                  :underline="false"
                  @click="getDataDetails(scope.row.id, scope.row.info_id)"
                >详情</el-link>
                <el-link
                  icon="el-icon-edit"
                  type="primary"
                  :underline="false"
                  style="margin-left: 15px;"
                  @click="editDataInfo(scope.row)"
                >编辑</el-link>
                <el-link
                  icon="el-icon-delete"
                  type="primary"
                  :underline="false"
                  style="margin-left: 15px;"
                  @click="deleteDataHandle(scope.row.id)"
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

      <!-- 新建资源数据 -->
      <el-drawer
        size="60%"
        :with-header="false"
        type="primary"
        :visible.sync="bizDialog"
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
              {{ createOrUpdateTitle }}
            </div>
            <div>
              <renderModel
                v-if="renderModelStatus"
                ref="fieldForm"
                :fields="fields.field_groups"
                :biz-dialog.sync="bizDialog"
                :is-submit="submitStatus"
                :field-data="fieldData"
                @getList="getList"
              />
            </div>
          </div>
        </div>
      </el-drawer>

      <!-- 为资源分配业务模块 -->
      <el-dialog
        title="资源分配"
        :visible.sync="distributionDialog"
        width="30%"
      >
        <el-tree
          :data="treeData"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span v-if="node.level === 3">
              <el-checkbox v-model="bindDataModels[data.id]" @change="selectModels(data.info_id)" />
            </span>
            <span style="margin-left: 5px;">{{ node.data.data.built_in_field_name }}</span>
          </span>
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="distributionDialog = false">取 消</el-button>
          <el-button type="primary" @click="bindSubmit">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 数据导入 -->
      <el-drawer
        size="50%"
        :with-header="false"
        type="primary"
        :visible.sync="importDialog"
        direction="rtl"
        :wrapper-closable="false"
      >
        <div>
          <div class="model-field-sideslider-header">
            <div class="model-field-sideslider-closer" style="float: left;" @click="importDialog = false">
              <i
                class="el-icon-arrow-right"
              />
            </div>
            <div class="model-field-sideslider-title" style="padding: 0px 0px 0px 50px;">
              导入资源
            </div>
            <div style="padding: 25px;">
              <el-form ref="ruleForm" :model="ruleForm" label-width="92px">
                <el-form-item label="资源状态：">
                  <el-select
                    v-model="ruleForm.status"
                    size="small"
                    placeholder="请选择资源状态"
                    style="width: 100%"
                  >
                    <el-option label="无状态" :value="0" />
                    <el-option label="空闲" :value="1" />
                    <el-option label="故障" :value="2" />
                    <el-option label="待回收" :value="3" />
                    <el-option label="正在使用" :value="4" />
                  </el-select>
                </el-form-item>
                <el-form-item label="上传文件：">
                  <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
                  <div class="el-upload__tip">只能上传 execl 文件，且不超过20M</div>
                  <el-button type="text" icon="el-icon-download" @click="downloadDataTemplate">点击下载模板</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </el-drawer>
    </template>
  </BasicLayout>
</template>

<script>
import UploadExcelComponent from './components/ImportData'
import { parseTime } from '@/utils'

import {
  modelFields,
  modelDetails
} from '@/api/cmdb/model'

import {
  getDataList,
  deleteData,
  bindDataRelated,
  exportData,
  batchCreateData
} from '@/api/cmdb/resource'

import {
  getBusinessTree
} from '@/api/cmdb/business'

import renderModel from '@/views/cmdb/model/components/render-model'
export default {
  components: {
    renderModel,
    UploadExcelComponent
  },
  data() {
    return {
      searchShow: false,
      importDialog: false,
      exportLoading: false,
      distributionDialog: false,
      submitStatus: 'create',
      renderModelStatus: false,
      bizDialog: false,
      loading: false,
      list: [],
      fields: {},
      fieldList: [],
      total: 0,
      search_list: [{
        identifies: '',
        value: ''
      }],
      queryParams: {
        page: 1,
        per_page: 10,
        search_type: 1,
        search_classiy: 1
      },
      createOrUpdateTitle: '新建',
      fieldData: {},
      treeData: [],
      bindData: {
        asset: {
          model: 0,
          list: []
        },
        models: {
          model: 0,
          list: []
        }
      },
      bindDataModels: {},
      ruleForm: {
        status: 0
      }
    }
  },
  created() {
    this.getModelDetails()
    this.getModelDetailsForm()
  },
  methods: {
    getList() {
      this.loading = true
      this.queryParams.search_list = JSON.stringify(this.search_list)
      getDataList(this.$route.params.classify, this.queryParams).then(response => {
        this.list = []
        if (response.data.total_count > 0) {
          for (var l of response.data.list) {
            l.data.id = l.id
            l.data.info_id = l.info_id
            l.data.uuid = l.uuid
            this.list.push(l.data)
          }
        }
        this.total = response.data.total_count
        this.loading = false
      })
    },
    distribution() {
      // 1. 判断有没有选中资产
      if (this.bindData.asset.list.length > 0) {
        this.getTree()
        this.distributionDialog = true
      } else {
        this.$message.info('请选择资产，然后进行分配')
      }
    },
    getTree() {
      getBusinessTree().then(res => {
        this.treeData = res.data
      })
    },
    getModelDetails() {
      modelFields(this.$route.params.classify).then(res => {
        this.fieldList = res.data
        this.renderModelStatus = true
        this.getList()
      })
    },
    getModelDetailsForm() {
      modelDetails(this.$route.params.classify).then(res => {
        this.fields = res.data
      })
    },
    deleteDataHandle(id) {
      this.$confirm('是否删除此数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(id).then(() => {
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
    createDataInfo() {
      this.submitStatus = 'create'
      this.fieldData = {}
      this.createOrUpdateTitle = '新建' + this.fields.name
      this.bizDialog = true
      this.$nextTick(() => {
        this.$refs.fieldForm.clearValidateHandle()
      })
    },
    editDataInfo(row) {
      this.fieldData = row
      this.submitStatus = 'edit'
      this.createOrUpdateTitle = '编辑' + this.fields.name
      this.bizDialog = true
      this.$nextTick(() => {
        this.$refs.fieldForm.clearValidateHandle()
      })
    },
    getDataDetails(id, info_id) {
      this.$router.push({ path: '/cmdb/resource/details', query: { 'info_id': info_id, 'id': id }})
    },
    handleSelectionChange(val) {
      if (val.length > 0) {
        for (var v of val) {
          this.bindData.asset.list.push(v.id)
        }
        this.bindData.asset.model = val[0].info_id
      }
    },
    selectModels(infoId) {
      this.bindData.models.model = infoId
      for (var k in this.bindDataModels) {
        var i = this.bindData.models.list.indexOf(parseInt(k))
        if (this.bindDataModels[k] && i === -1) {
          this.bindData.models.list.push(parseInt(k))
        } else if (!this.bindDataModels[k] && i !== -1) {
          this.bindData.models.list.splice(i, 1)
        }
      }
    },
    bindSubmit() {
      if (this.bindData.models.list.length > 0 && this.bindData.asset.list.length > 0) {
        bindDataRelated(this.bindData).then(res => {
          this.distributionDialog = false
        })
      }
    },
    handleExportData() {
      this.$confirm('此操作将导出此模型的全部数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.exportLoading = true
        exportData(this.$route.params.classify).then(res => {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = res.data.tHeader
            const filterVal = res.data.filterVal
            const data = this.formatJson(filterVal, res.data.dataList)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.fields.identifies,
              autoWidth: true,
              bookType: 'xlsx',
              colStyle: 1
            })
            this.exportLoading = false
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    downloadDataTemplate() {
      var fieldNameList = ['字段名称(请勿修改)']
      var fieldKeyList = ['字段标识(请勿修改)']
      for (var f of this.fieldList) {
        fieldNameList.push(f.name)
        fieldKeyList.push(f.identifies)
      }
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = fieldNameList
        const titles = fieldKeyList
        excel.export_json_to_excel({
          title: titles,
          header: tHeader,
          data: [],
          filename: 'import_' + this.fields.identifies + '_template',
          autoWidth: true,
          bookType: 'xlsx',
          colStyle: 2,
          unitStyle: ['A1', 'A2']
        })
      })
    },
    beforeUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20

      if (isLt20M) {
        return true
      }

      this.$message({
        message: '请不要上传大于20M的文件。',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results }) {
      const loading = this.$loading({
        lock: true,
        text: '正在导入数据，请稍等...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      var dataList = []
      for (var r of results) {
        dataList.push({
          info_id: parseInt(this.$route.params.classify),
          status: this.ruleForm.status,
          data: r
        })
      }
      batchCreateData(dataList).then(() => {
        this.getList()
        this.$message({
          type: 'success',
          message: '导入成功!'
        })
        loading.close()
        this.importDialog = false
      }).catch(() => {
        loading.close()
      })
    },
    addSearchContent() {
      this.search_list.push({
        identifies: '',
        value: ''
      })
    },
    delSearchContent(index) {
      this.search_list.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
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

  /deep/ .el-form-item__content {
    line-height: 20px;
  }

  /deep/ .search-list .el-form-item-content {
    margin-bottom: 10px;
  }

  /deep/ .search-list .el-form-item-button {
    margin-top: 15px;
    margin-bottom: 0;
  }

  /deep/ .search-list .el-form-item-content .el-form-item__label {
    line-height: 28px;
  }
</style>
