<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>资源详情</span>
        </div>
        <div>
          <div v-for="field_groups of fields.field_groups" :key="field_groups.id" class="group">
            <div class="group-name">{{ field_groups.name }}</div>
            <ul class="property-list">
              <li v-for="field of field_groups.fields" id="property-item-1" :key="field.id" class="property-item">
                <span class="property-name" tabindex="0">
                  {{ field.name }} :
                </span>
                <span class="property-value" tabindex="0">
                  <span class="value-default-theme">{{ fieldForm[field.identifies] }}</span>
                </span>
                <div class="copy-box">
                  <i class="property-copy icon-cc-details-copy" />
                </div>
              </li>
            </ul>
          </div>
          <div v-if="relatedFileds.length > 0" class="group">
            <div class="group-name">关联数据</div>
            <template v-for="(item, index) in relatedFileds">
              <div :key="index" class="property-list-associate">
                <span class="property-name" tabindex="0">
                  {{ item.name }}，数量: {{ relatedModelData[item.identifies].length }}
                  <el-tooltip class="item" effect="dark" content="添加数据关联" placement="top-start">
                    <i
                      class="el-icon-circle-plus-outline"
                      style="cursor: pointer; margin-left: 10px;"
                      @click="addRelateHandle(item)"
                    />
                  </el-tooltip>
                </span>
                <el-table
                  v-loading="loading"
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  size="mini"
                  :data="relatedModelData[item.identifies]"
                  border
                  style="margin-top: 12px;"
                >
                  <template v-for="field of item.fields">
                    <el-table-column
                      v-if="field.is_list_display"
                      :key="field.id"
                      :prop="field.identifies"
                      :label="field.name"
                    />
                  </template>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="60"
                  >
                    <template slot-scope="{row}">
                      <el-button type="text" size="small" @click="handleDeleteRelated(row.related_id)">解绑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </div>
        </div>
      </el-card>

      <el-dialog
        title="添加关联数据"
        :visible.sync="addRelatedDialog"
        width="80%"
      >
        <div style="padding-bottom: 20px">
          <!-- 操作 -->
          <div>
            <el-input
              v-model="search_list[0].value"
              size="small"
              placeholder="请输入搜索内容"
              class="input-with-select"
              style="width: 380px; margin-bottom: 10px; margin-right: 30px"
              @keyup.enter.native="getModelDataList"
            >
              <el-select slot="prepend" v-model="search_list[0].identifies" placeholder="请选择" style="width: 95px">
                <el-option v-for="fieldItem of fieldList" :key="fieldItem.id" :label="fieldItem.name" :value="fieldItem.identifies" />
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="getModelDataList" />
            </el-input>
            <el-radio-group v-model="listQuery.search_classiy" size="small">
              <el-radio :label="1">精确搜索</el-radio>
              <el-radio :label="2">模糊搜索</el-radio>
            </el-radio-group>
          </div>
          <el-table v-loading="dataLoading" :data="list" border @selection-change="handleSelectionChange">
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
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.per_page"
            @pagination="getModelDataList"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRelatedDialog = false">取 消</el-button>
          <el-button type="primary" @click="addRelatedDataSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </BasicLayout>
</template>

<script>
import {
  modelDetails,
  relatedInfoFields
} from '@/api/cmdb/model'

import {
  getDataList,
  dataDetails,
  deleteDataRelated,
  addRelatedData
} from '@/api/cmdb/resource'
export default {
  data() {
    return {
      fieldList: [],
      fields: {},
      fieldForm: {},
      relatedFileds: [],
      relatedModelData: {},
      list: [],
      total: 0,
      loading: false,
      dataLoading: false,
      addRelatedDialog: false,
      search_list: [{
        identifies: '',
        value: ''
      }],
      listQuery: {
        page: 1,
        per_page: 10,
        search_type: 1,
        search_classiy: 2
      },
      relatedModel: {},
      relatedTargetList: []
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      this.getModelDetailsForm()
      this.getRelatedInfoFileds()
    },
    getRelatedInfoFileds() {
      relatedInfoFields(this.$route.query.info_id, { data_id: this.$route.query.id }).then(res => {
        this.relatedFileds = res.data.fields
        this.relatedModelData = res.data.data
      })
    },
    getModelDataList() {
      this.fieldList = this.relatedModel.fields
      this.dataLoading = true
      this.listQuery.search_list = JSON.stringify(this.search_list)
      getDataList(this.relatedModel.id, this.listQuery).then(response => {
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
        this.dataLoading = false
      })
    },
    addRelateHandle(item) {
      this.relatedModel = item
      this.addRelatedDialog = true
      this.getModelDataList()
    },
    getModelDetails() {
      dataDetails(this.$route.query.id).then(res => {
        this.fieldForm = res.data.data
      })
    },
    handleSelectionChange(val) {
      this.relatedTargetList = []
      for (var v of val) {
        this.relatedTargetList.push(v.id)
      }
    },
    addRelatedDataSubmit() {
      if (this.relatedTargetList.length > 0) {
        var jsonParams = {
          source: parseInt(this.$route.query.id),
          target: this.relatedTargetList,
          source_info_id: parseInt(this.$route.query.info_id),
          target_info_id: this.relatedModel.id
        }
        addRelatedData(jsonParams).then(res => {
          this.getRelatedInfoFileds()
          this.addRelatedDialog = false
          this.$message({
            type: 'success',
            message: '关联资源成功'
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择需要绑定的目标资源数据'
        })
      }
    },
    getModelDetailsForm() {
      modelDetails(this.$route.query.info_id).then(res => {
        this.fields = res.data
        this.getModelDetails()
      })
    },
    handleDeleteRelated(id) {
      this.$confirm('是否删除此条数据关联?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteDataRelated(id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initForm()
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
  .group .group-name:before {
    content: "";
    display: inline-block;
    vertical-align: -2px;
    width: 4px;
    height: 14px;
    margin-right: 9px;
    margin-top: 10px;
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

  .property-list-associate {
    color: #63656e;
    font-size: 14px;
    margin-top: 20px;
    padding-left: 14px;
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
