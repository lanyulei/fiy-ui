<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 提示 -->
        <div style="margin-bottom: 15px;">
          <el-alert
            style="background: #F0F8FF; color: #63656E"
            title="集群模板可以定义业务通用的集群结构，用于业务拓扑中快速部署和维护集群。此功能依赖已经存在服务模板。"
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

        <el-dialog
          title="提示"
          :visible.sync="dialogVisible.dialog"
          width="50%"
          :close-on-click-modal="false"
        >
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="90px">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="ruleForm.name" size="small" />
            </el-form-item>
            <el-form-item label="集群拓扑" prop="name">
              <div class="cluster-topology">
                <div class="cluster-topology-title">
                  <!-- <svg-icon icon-class="ji" style="font-size: 20px; margin-left: 5px;" /> -->
                  <i class="fiy-node-icon fl">集</i>
                  <span>模板集群名称</span>
                </div>
                <div class="cluster-topology-body">
                  <ul class="node-children">
                    <li class="node-child clearfix">
                      <i class="fiy-node-icon fl">模</i>
                      <span class="fr">
                        <i class="fiy-node-icon-operate el-icon-view" style="margin-right: 8px;" />
                        <i class="fiy-node-icon-operate el-icon-close" />
                      </span>
                      <span class="child-name">appt</span>
                    </li>

                    <li class="options-child node-child clearfix">
                      <span style="cursor: pointer;">
                        <i class="el-icon-circle-plus-outline" style="font-size: 20px; margin-right: 3px; color: #3A84FF;" />
                        <span class="child-name">添加服务模板</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>

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
      loading: false,
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        per_page: 10
      },
      dialogVisible: {},
      ruleForm: {},
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }]
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
      this.ruleForm = {}
      this.dialogVisible = {
        title: '新建集群',
        status: 'create',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    editData(row) {
      this.ruleForm = {}
      this.dialogVisible = {
        title: '编辑集群',
        status: 'edit',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
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
  .cluster-topology {
    padding: 10px 20px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }

  .cluster-topology-title {
    height: 36px;
    line-height: 36px;
  }

  .cluster-topology-body .node-children {
    line-height: 36px;
    cursor: default;
  }

  .cluster-topology-body .node-children .node-child {
    padding: 0 10px 0 28px;
    position: relative;
  }

  .cluster-topology-body .node-children .node-child:hover {
    background-color: #F0F1F5;
  }

  .cluster-topology-body .node-children .node-child:hover .fiy-node-icon-operate {
    display: inline-block;
  }

  .cluster-topology-body .clearfix {
    zoom: 1;
  }

  .cluster-topology-body .node-child:before {
    position: absolute;
    left: 0px;
    top: -18px;
    content: "";
    width: 25px;
    height: 36px;
    border-left: 1px dashed #DCDEE5;
    border-bottom: 1px dashed #DCDEE5;
    z-index: 1;
  }

  .cluster-topology-body .clearfix:before, .clearfix:after {
    content: "";
    display: table;
    clear: both;
  }

  .cluster-topology-body .node-children .node-child.options-child .child-name {
    color: #3A84FF;
  }

  .cluster-topology-body ul, dl {
    list-style: none;
  }

  .cluster-topology-body ul {
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 10px;
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

  .fiy-node-icon-operate {
    font-size: 16px;
    cursor: pointer;
    display: none;
  }

  .fiy-node-icon-operate:hover {
    color: #3A84FF;
  }
</style>
