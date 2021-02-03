<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ fields.name }}</span>
      </div>
      <!-- 操作 -->
      <div>
        <el-row>
          <el-button size="mini" type="primary" @click="createBiz">新建</el-button>
          <el-input
            v-model="queryParams.value"
            size="mini"
            placeholder="请输入内容"
            class="input-with-select"
            style="width: 500px; margin-left: 10px"
            @keyup.enter.native="getList"
          >
            <el-select slot="prepend" v-model="queryParams.identifies" placeholder="请选择" style="width: 100px;">
              <el-option v-for="field of fieldList" :key="field.id" :label="field.name" :value="field.identifies" />
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="getList" />
          </el-input>
        </el-row>
      </div>
      <!-- 模型列表 -->
      <div style="margin-top: 15px;">
        <el-table v-loading="loading" :data="list" border>
          <el-table-column
            v-for="field of fieldList"
            :key="field.id"
            :prop="field.identifies"
            :label="field.name"
          />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-link
                icon="el-icon-edit"
                type="primary"
                :underline="false"
                @click="editBiz(scope.row)"
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
      size="36%"
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
  </div>
</template>

<script>
import {
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
      modelDetails(this.$route.params.classify).then(res => {
        this.fields = res.data
        this.renderModelStatus = true
        for (var groups of this.fields.field_groups) {
          for (var field of groups.fields) {
            this.fieldList.push(field)
          }
        }
        this.getList()
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
    createBiz() {
      this.submitStatus = 'create'
      this.fieldData = {}
      this.createOrUpdateTitle = '新建业务'
      this.bizDialog = true
      this.$nextTick(() => {
        this.$refs.fieldForm.clearValidateHandle()
      })
    },
    editBiz(row) {
      this.fieldData = row
      this.submitStatus = 'edit'
      this.createOrUpdateTitle = '编辑业务'
      this.bizDialog = true
      this.$nextTick(() => {
        this.$refs.fieldForm.clearValidateHandle()
      })
    }
  }
}
</script>

<style scoped>
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
</style>
