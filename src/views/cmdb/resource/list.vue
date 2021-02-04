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
            <el-button size="mini" type="primary" @click="createDataInfo">新建</el-button>
            <el-input
              v-model="queryParams.value"
              size="mini"
              placeholder="请输入内容"
              class="input-with-select"
              style="width: 500px; margin-left: 10px"
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
          <el-table v-loading="loading" :data="list" border>
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
  deleteData
} from '@/api/cmdb/resource'

import renderModel from '@/views/cmdb/model/components/render-model'
export default {
  components: {
    renderModel
  },
  data() {
    return {
      submitStatus: 'create',
      renderModelStatus: false,
      bizDialog: false,
      loading: false,
      list: [],
      fields: {},
      fieldList: [],
      total: 0,
      queryParams: {
        page: 1,
        per_page: 10
      },
      createOrUpdateTitle: '新建业务',
      fieldData: {}
    }
  },
  created() {
    this.getModelDetails()
    this.getModelDetailsForm()
  },
  methods: {
    getList() {
      this.loading = true
      getDataList(this.$route.params.classify, this.queryParams).then(response => {
        this.list = []
        if (response.data.total_count > 0) {
          for (var l of response.data.list) {
            l.data.id = l.id
            l.data.info_id = l.info_id
            this.list.push(l.data)
          }
        }
        this.total = response.data.total_count
        this.loading = false
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
      this.createOrUpdateTitle = '新建业务'
      this.bizDialog = true
      this.$nextTick(() => {
        this.$refs.fieldForm.clearValidateHandle()
      })
    },
    editDataInfo(row) {
      this.fieldData = row
      this.submitStatus = 'edit'
      this.createOrUpdateTitle = '编辑业务'
      this.bizDialog = true
      this.$nextTick(() => {
        this.$refs.fieldForm.clearValidateHandle()
      })
    },
    getDataDetails(id, info_id) {
      this.$router.push({ name: 'ResourceDetails', params: { 'id': id }, query: { 'fieldId': info_id }})
    }
  }
}
</script>

<style scoped>

</style>
