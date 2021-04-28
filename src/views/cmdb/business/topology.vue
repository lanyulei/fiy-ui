<template>
  <BasicLayout>
    <template #wrapper>
      <el-row>
        <el-col :span="5">
          <el-card class="box-card">
            <el-input
              v-model="filterText"
              suffix-icon="el-icon-search"
              size="small"
              placeholder="输入关键字进行过滤"
              style="margin-bottom: 15px;"
            />
            <el-tree
              :data="treeData"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              @node-contextmenu="handleContextmenu"
            >
              <span slot-scope="{ node }" v-contextmenu:contextmenu class="custom-tree-node">
                <i v-if="node.level === 1" class="fiy-node-icon">业</i>
                <i v-else-if="node.level === 2" class="fiy-node-icon">集</i>
                <i v-else-if="node.level === 3" class="fiy-node-icon">模</i>
                <span>{{ node.data.data.built_in_field_name }}</span>
              </span>
            </el-tree>
            <template>
              <v-contextmenu ref="contextmenu">
                <v-contextmenu-item @click="addNodeHandler"><i class="el-icon-plus" /> 新增</v-contextmenu-item>
                <v-contextmenu-item @click="delNodeHandler"><i class="el-icon-delete" /> 删除</v-contextmenu-item>
              </v-contextmenu>
            </template>
          </el-card>
        </el-col>
        <el-col :span="19" style="padding-left: 10px">
          <el-tabs type="border-card">
            <el-tab-pane label="资源列表">
              <div v-if="currentNodeInfo === null" class="currentDataNull">
                点击左侧树节点，展示相应的资源列表
              </div>
              <div v-else-if="groupModelList.length < 1" class="currentDataNull">
                节点暂未分配数据
              </div>
              <div v-else>
                <!-- 操作 -->
                <div>
                  <el-row>
                    <el-select
                      v-model="currentModel"
                      placeholder="请选择"
                      size="mini"
                      style="margin-right: 10px"
                      @change="getFieldsData"
                    >
                      <el-option-group
                        v-for="(groupItem, groupIndex) in groupModelList"
                        :key="groupIndex"
                        :label="groupItem.name"
                      >
                        <el-option
                          v-for="modelItem in groupItem.model_list"
                          :key="modelItem.id"
                          :label="modelItem.name"
                          :value="modelItem.id"
                        />
                      </el-option-group>
                    </el-select>
                    <el-input
                      v-model="queryParams.value"
                      size="mini"
                      placeholder="请输入内容"
                      class="input-with-select"
                      style="width: 500px;"
                      @keyup.enter.native="getList"
                    >
                      <el-select slot="prepend" v-model="queryParams.identifies" placeholder="请选择" style="width: 95px">
                        <el-option v-for="fieldItem of fieldList" :key="fieldItem.id" :label="fieldItem.name" :value="fieldItem.identifies" />
                      </el-select>
                      <el-button slot="append" icon="el-icon-search" @click="getList" />
                    </el-input>
                  </el-row>
                </div>
                <!-- 模型列表 -->
                <div style="margin-top: 15px;">
                  <el-table v-loading="loading" :data="dataList" border>
                    <template v-for="field of fieldList">
                      <el-table-column
                        v-if="field.is_list_display"
                        :key="field.id"
                        :prop="field.identifies"
                        :label="field.name"
                      />
                    </template>
                  </el-table>
                  <pagination
                    v-show="dataTotal>0"
                    :total="dataTotal"
                    :page.sync="queryParams.page"
                    :limit.sync="queryParams.per_page"
                    @pagination="getList"
                  />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="节点信息">
              <div v-if="currentNodeInfo === null" class="currentDataNull">
                点击左侧树节点，展示节点信息
              </div>
              <div v-else>
                <div v-for="field_groups of currentFields.field_groups" :key="field_groups.id" class="group">
                  <div class="group-name">{{ field_groups.name }}</div>
                  <ul class="property-list">
                    <li v-for="field of field_groups.fields" id="property-item-1" :key="field.id" class="property-item">
                      <span class="property-name" tabindex="0">
                        {{ field.name }} :
                      </span>
                      <span class="property-value" tabindex="0">
                        <span class="value-default-theme">{{ currentNodeInfo[field.identifies] }}</span>
                      </span>
                      <div class="copy-box">
                        <i class="property-copy icon-cc-details-copy" />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>

      <el-dialog
        title="添加子节点"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
          <el-form-item label="新建方式：">
            <el-radio-group v-model="createClassifyStatus" size="small" @change="changeCreateClassify">
              <el-radio :label="1">从模板新建</el-radio>
              <el-radio :label="2">直接新建</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="createClassifyStatus===1" label="模板：" prop="template">
            <el-select v-model="ruleForm.template" placeholder="请选择" size="small" style="width:100%">
              <el-option
                v-for="item in templates"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="名称：" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入内容" size="small" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
      </el-dialog>

    </template>
  </BasicLayout>
</template>

<script>
import {
  modelFields,
  modelDetails
} from '@/api/cmdb/model'

import {
  getDataList,
  dataDetails,
  getNodeModelData
} from '@/api/cmdb/resource'

import {
  clusterTplList,
  getBusinessTree,
  addNode,
  svcTplList
} from '@/api/cmdb/business'

export default {
  components: {

  },
  data() {
    return {
      createClassifyStatus: 1,
      clusterTpl: {},
      templates: [],
      dialogVisible: false,
      currentNodeInfo: null,
      currentNode: null,
      currentLevel: 0,
      currentFields: {},
      currentModel: 0,
      groupModelList: [],
      fields: {},
      loading: false,
      fieldList: [],
      dataList: null,
      dataTotal: 0,
      filterText: '',
      treeData: [],
      queryParams: {
        page: 1,
        per_page: 10
      },
      ruleForm: {},
      rules: {
        name: [
          { required: true, message: `名称必填`, trigger: 'blur' }
        ],
        template: [
          { required: true, message: `模板必选`, trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    getList() {
      this.loading = true
      getDataList(this.currentModel, this.queryParams).then(response => {
        this.dataList = []
        if (response.data.total_count > 0) {
          for (var l of response.data.list) {
            l.data.id = l.id
            l.data.info_id = l.info_id
            this.dataList.push(l.data)
          }
        }
        this.dataTotal = response.data.total_count
        this.loading = false
      })
    },
    getClusterTemplates() {
      clusterTplList({
        per_page: 99999
      }).then(res => {
        this.templates = res.data.list
      })
    },
    getSvcTemplates() {
      svcTplList({
        per_page: 99999
      }).then(res => {
        this.templates = res.data.list
      })
    },
    getFieldsData() {
      modelDetails(this.currentModel).then(res => {
        this.fields = res.data
      })
      modelFields(this.currentModel).then(res => {
        this.fieldList = res.data
        this.queryParams.nodeID = this.currentNode.id
        this.getList()
      })
    },
    changeCreateClassify() {
      if (this.createClassifyStatus === 2) {
        this.ruleForm.template = null
      }
    },
    getTree() {
      getBusinessTree().then(res => {
        this.treeData = res.data
      })
    },
    handleNodeClick(data, node) {
      this.currentNode = data

      // 查询节点信息
      modelDetails(data.info_id).then(res => {
        this.currentFields = res.data
        dataDetails(data.id).then(res => {
          this.currentNodeInfo = res.data.data
        })
      })

      // 查询节点对应的资源数据
      var params = {
        level: node.level,
        nodeID: data.id
      }
      getNodeModelData(params).then(res => {
        this.groupModelList = res.data
        if (this.groupModelList.length > 0) {
          if (this.groupModelList[0].model_list.length > 0) {
            this.currentModel = this.groupModelList[0].model_list[0].id
            this.getFieldsData()
          }
        }
      })
    },
    handleContextmenu(event, data, node, vm) {
      this.templates = []
      this.currentNode = data
      this.currentLevel = node.level
      this.ruleForm = {
        source: data.id,
        source_info_id: data.info_id
      }
      if (node.level === 1) {
        this.getClusterTemplates()
        this.ruleForm.classify = 1
      } else if (node.level === 2) {
        this.getSvcTemplates()
        this.ruleForm.classify = 2
      }
    },
    addNodeHandler() {
      if (this.currentLevel === 3) {
        this.$message({
          type: 'error',
          message: '当前层级节点无法执行此操作'
        })
      } else {
        this.createClassifyStatus = 1
        this.dialogVisible = true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    delNodeHandler() {

    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addNode(this.ruleForm).then(res => {
            this.getTree()
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.dialogVisible = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .custom-tree-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .fiy-node-icon {
    position: relative;
    margin: 8px 4px 8px 0px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    font-style: normal;
    color: #fff;
    background-color: #97AED6;
    z-index: 2;
  }

  .currentDataNull {
    height: 200px;
    line-height: 200px;
    text-align: center;
    font-size: 28px;
    color: #ddd;
  }

  .group .group-name:before {
    content: "";
    display: inline-block;
    vertical-align: -2px;
    width: 4px;
    height: 14px;
    margin-right: 9px;
    background-color: #c3cdd7;
  }

  .group .group-name {
    line-height: 21px;
    font-size: 16px;
    font-weight: normal;
    color: #333948;
  }

  .property-list {
    width: 80%;
    color: #63656e;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-bottom: 0;
  }

  .property-list .property-item {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
    padding-bottom: 8px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }

  .property-list .property-item .property-name {
    position: relative;
    /* width: 150px; */
    line-height: 32px;
    padding: 0 16px 0 0;
    font-size: 14px;
    color: #63656E;
    /* overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
  }

  .property-list .property-item .property-value {
    margin: 6px 0 0 4px;
    max-width: 75%;
    font-size: 14px;
    color: #313237;
    /* overflow: hidden; */
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    /* -webkit-line-clamp: 2; */
    -webkit-box-orient: vertical;
  }

  ul, dl {
    list-style: none;
  }
</style>
