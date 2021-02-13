<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 提示 -->
        <div style="margin-bottom: 15px;">
          <el-alert
            style="background: #F0F8FF; color: #63656E"
            title="服务模板可以预定义业务通用的服务，用于业务拓扑中批量部署和变更服务实例。"
            type="info"
            show-icon
          />
        </div>

        <!-- 操作 -->
        <div>
          <el-row>
            <el-button size="mini" type="primary" @click="createData">新建</el-button>
            <el-input
              v-model="listQuery.name"
              size="mini"
              placeholder="请输入服务模板名称"
              class="input-with-select"
              style="width: 300px; margin-left: 10px"
              @keyup.enter.native="getList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getList" />
            </el-input>
          </el-row>
        </div>

        <div style="margin-top: 15px;">
          <el-table v-loading="loading" :data="list" border>
            <el-table-column
              prop="name"
              label="模板名称"
            />
            <el-table-column
              prop="svc_classify_name"
              label="模板分类"
            />
            <el-table-column
              prop="modify_name"
              label="修改人"
            />
            <el-table-column
              label="修改时间"
            >
              <template slot-scope="{row}">
                {{ row.updatedAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150px;">
              <template slot-scope="scope">
                <el-link
                  icon="el-icon-edit"
                  type="primary"
                  :underline="false"
                  @click="editData(scope.row)"
                >编辑</el-link>
                <el-link
                  icon="el-icon-delete"
                  type="primary"
                  :underline="false"
                  style="margin-left: 15px;"
                  @click="deleteData(scope.row.id)"
                >删除</el-link>
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
    </template>
  </BasicLayout>
</template>

<script>
import {
  svcTplList,
  deleteSvcTpl
} from '@/api/cmdb/business'
export default {
  components: {
  },
  data() {
    return {
      setKey: {
        value: 'id',
        label: 'name',
        children: 'services'
      }, // 自定义  级联选择器value label
      loading: false,
      ruleForm: {},
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        per_page: 10
      },
      dialogForm: { },
      processDialog: { },
      processRuleForm: {},
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        alias: [{ required: true, message: '必填', trigger: 'blur' }],
        svc_classify: [{ required: true, message: '必选', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      svcTplList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total_count
        this.loading = false
      })
    },
    createData() {
      this.$router.push({ name: 'BusinessSvcTplManager', query: { status: 'create' }})
    },
    editData(row) {
      this.$router.push({ name: 'BusinessSvcTplManager', query: { status: 'edit', id: row.id }})
    },
    deleteData(id) {
      this.$confirm('是否删除此模版?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteSvcTpl(id).then(() => {
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

<style lang="scss" scoped>
  .create-template-title {
    color: #63656e;
    font-size: 16px;
    padding-bottom: 10px;
    font-weight: 700;
  }

  /deep/ .create-process-dialog .el-form-item__label {
    padding: 0;
    line-height: 25px;
  }

  /deep/ .create-process-dialog .el-form-item {
    margin-bottom: 10px;
  }
</style>
