<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <div style="margin-bottom: 15px;">
          <el-alert
            style="background: #F0F8FF; color: #63656E"
            title="双击对应行，即可查看数据变更详情。"
            type="info"
            show-icon
          />
        </div>

        <!-- 操作 -->
        <div>
          <el-row>
            <el-input
              v-model="listQuery.value"
              size="mini"
              placeholder="请输入搜索内容"
              class="input-with-select"
              style="width: 450px; margin-right: 10px;"
              @keyup.enter.native="getList"
            >
              <el-select slot="prepend" v-model="listQuery.field" placeholder="请选择" style="width: 95px">
                <el-option label="分类" value="classify" />
                <el-option label="功能模块" value="features" />
                <el-option label="动作" value="action" />
                <el-option label="描述" value="describe" />
                <el-option label="操作账号" value="username" />
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="getList" />
            </el-input>
            <el-date-picker
              v-model="listQuery.rangeTime"
              size="mini"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              @change="getList"
            />
          </el-row>
        </div>

        <div style="margin-top: 15px;">
          <el-table
            v-loading="loading"
            :data="list"
            border
            @row-dblclick="getComparedData"
          >
            <el-table-column
              prop="classify"
              label="分类"
            />
            <el-table-column
              prop="features"
              label="功能模块"
            />
            <el-table-column
              prop="action"
              label="动作"
            />
            <el-table-column
              prop="describe"
              label="描述"
            />
            <el-table-column
              prop="username"
              label="操作账号"
            />
            <el-table-column
              label="操作时间"
            >
              <template slot-scope="{row}">
                {{ row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.per_page"
            @pagination="getList"
          />
        </div>

      </el-card>

      <el-drawer
        size="90%"
        :with-header="false"
        type="primary"
        :visible.sync="drawerVisible"
        direction="rtl"
        :wrapper-closable="false"
      >
        <div>
          <div class="model-field-sideslider-header">
            <div class="model-field-sideslider-closer" style="float: left;" @click="drawerVisible = false">
              <i
                class="el-icon-arrow-right"
              />
            </div>
            <div class="model-field-sideslider-title" style="padding: 0px 0px 0px 50px;">
              变更详情
            </div>
            <div style="padding: 23px 20px 20px 20px;">
              <div style="margin-bottom: 15px;">
                <el-alert
                  style="background: #F0F8FF; color: #63656E"
                  title="左侧为变更之前的数据，右侧为变更之后的数据。"
                  type="info"
                  show-icon
                />
              </div>
              <div v-if="dataLoading" style="height: 200px; line-height: 200px; text-align: center;">
                <i class="el-icon-loading" style="font-size: 35px;" />
              </div>
              <div v-else>
                <el-radio-group v-model="outputFormat" size="mini" style="margin-bottom: 12px;">
                  <el-radio :label="'side-by-side'">左右对比</el-radio>
                  <el-radio :label="'line-by-line'">上下对比</el-radio>
                </el-radio-group>
                <code-diff v-if="codeDiffLoading" :old-string="oldData" :new-string="newData" :output-format="outputFormat" :context="10" />
              </div>
            </div>
          </div>
        </div>
      </el-drawer>
    </template>
  </BasicLayout>
</template>

<script>
import CodeDiff from 'vue-code-diff'

import {
  getAuditList,
  getAuditDetails
} from '@/api/cmdb/analysis'
export default {
  components: {
    CodeDiff
  },
  data() {
    return {
      outputFormat: 'side-by-side',
      codeDiffLoading: true,
      dataLoading: true,
      drawerVisible: false,
      oldData: '',
      newData: '',
      loading: false,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        per_page: 10
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.listQuery.start_time = ''
      this.listQuery.end_time = ''
      if (this.listQuery.rangeTime !== undefined && this.listQuery.rangeTime !== null && this.listQuery.rangeTime.length === 2) {
        this.listQuery.start_time = this.listQuery.rangeTime[0]
        this.listQuery.end_time = this.listQuery.rangeTime[1]
      }
      getAuditList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total_count
        this.loading = false
      })
    },
    getComparedData(row, column, event) {
      this.dataLoading = true
      this.drawerVisible = true
      getAuditDetails(row.id).then(res => {
        this.oldData = JSON.stringify(res.data.old_data, null, '  ')
        this.newData = JSON.stringify(res.data.new_data, null, '  ')
        this.dataLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
