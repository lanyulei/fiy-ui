<template>
  <div>
    <el-card class="box-card">
      <!-- 操作 -->
      <div>
        <el-row>
          <el-button size="mini" type="primary" @click="addBiz">新建</el-button>
          <el-input
            v-model="queryParams.name"
            size="mini"
            placeholder="请输入名称"
            class="input-with-select"
            style="width: 300px; margin-left: 10px"
            @keyup.enter.native="getList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getList" />
          </el-input>
        </el-row>
      </div>
      <!-- 模型列表 -->
      <div style="margin-top: 15px;">
        <el-table v-loading="loading" :data="list" border>
          <el-table-column
            prop="identifies"
            label="唯一标识"
          />
          <el-table-column
            prop="name"
            label="名称"
          />
          <el-table-column
            prop="source_describe"
            label="源->目标描述"
          />
          <el-table-column
            prop="target_describe"
            label="目标->源描述"
          />
          <el-table-column
            label="使用数"
          >
            <template>
              0
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-link
                icon="el-icon-edit"
                type="primary"
                :underline="false"
              >编辑</el-link>
              <el-link
                icon="el-icon-delete"
                type="primary"
                :underline="false"
                style="margin-left: 15px;"
              >删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
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
            新建业务
          </div>
          <div>
            <renderModel v-if="renderModelStatus" :fields="fields.field_groups" />
          </div>
          <div style="text-align: center;">
            <span slot="footer" class="dialog-footer">
              <el-button @click="bizDialog = false">取 消</el-button>
              <el-button type="primary" @click="bizDialog = false">确 定</el-button>
            </span>
          </div>

        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  filterModelDetails
} from '@/api/cmdb/model'

import renderModel from '@/views/cmdb/model/components/render-model'
export default {
  components: {
    renderModel
  },
  data() {
    return {
      renderModelStatus: false,
      bizDialog: false,
      loading: false,
      list: [],
      fields: {},
      total: 0,
      queryParams: {
        page: 1,
        per_page: 10
      }
    }
  },
  created() {
    this.getModelDetails()
  },
  methods: {
    getList() {},
    getModelDetails() {
      filterModelDetails({
        identifies: 'built_in_biz'
      }).then(res => {
        this.fields = res.data
        this.renderModelStatus = true
      })
    },
    addBiz() {
      this.bizDialog = true
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
