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
              placeholder="请输入集群模板名称"
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
          :title="dialogVisible.title"
          :visible.sync="dialogVisible.dialog"
          width="50%"
          :close-on-click-modal="false"
        >
          <el-dialog
            width="48%"
            :title="innerVisible.title"
            :visible.sync="innerVisible.dialog"
            append-to-body
            :close-on-click-modal="false"
          >
            <div style="margin-bottom: 20px;">
              <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
              <div style="margin: 15px 0;" />
              <el-checkbox-group v-model="checkedSvcTpls" @change="handlecheckedSvcTplsChange">
                <el-checkbox v-for="s in svcTpls" :key="s.id" size="small" border :label="s.id">{{ s.name }}</el-checkbox>
              </el-checkbox-group>
            </div>

            <span slot="footer" class="dialog-footer">
              <el-button @click="innerVisible.dialog = false">取 消</el-button>
              <el-button type="primary" @click="addSvcTpl">确 定</el-button>
            </span>
          </el-dialog>
          <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="90px">
            <el-form-item label="模板名称" prop="name">
              <el-input v-model="ruleForm.name" size="small" />
            </el-form-item>
            <el-form-item label="集群拓扑" prop="name">
              <div class="cluster-topology">
                <div class="cluster-topology-title">
                  <i class="fiy-node-icon fl">集</i>
                  <span v-if="ruleForm.name === undefined || ruleForm.name === ''">模板集群名称</span>
                  <span v-else>{{ ruleForm.name }}</span>
                </div>
                <div class="cluster-topology-body">
                  <ul class="node-children">
                    <template v-if="currentSvcTpls.length > 0">
                      <li v-for="(s, i) in currentSvcTpls" :key="i" class="node-child clearfix">
                        <i class="fiy-node-icon fl">模</i>
                        <span class="fr">
                          <!-- <i class="fiy-node-icon-operate el-icon-view" style="margin-right: 8px;" /> -->
                          <i class="fiy-node-icon-operate el-icon-close" @click="delSvcTpl(i, s.id)" />
                        </span>
                        <span class="child-name">{{ s.name }}</span>
                      </li>
                    </template>

                    <li class="options-child node-child clearfix">
                      <span style="cursor: pointer;" @click="addSvcTplDialog">
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
      currentSvcTpls: [],
      checkAll: false,
      checkedSvcTpls: [],
      isIndeterminate: true,

      loading: false,
      svcTpls: [],
      list: [],
      total: 0,
      listQuery: {
        page: 1,
        per_page: 10
      },
      dialogVisible: {},
      innerVisible: {},
      ruleForm: {},
      rules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
    this.getsvcTplList()
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedSvcTpls = val ? this.cities : []
      this.isIndeterminate = false
    },
    handlecheckedSvcTplsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.svcTpls.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.svcTpls.length
    },
    getList() {},
    getsvcTplList() {
      svcTplList({
        per_page: 99999
      }).then(res => {
        this.svcTpls = res.data.list
      })
    },
    // 新建服务模板
    addSvcTpl() {
      if (this.dialogVisible.status === 'create') {
        this.currentSvcTpls = []
        for (var st of this.svcTpls) {
          if (this.checkedSvcTpls.indexOf(st.id) !== -1) {
            this.currentSvcTpls.push(st)
          }
        }
      }
    },
    delSvcTpl(i, v) {
      if (this.dialogVisible.status === 'create') {
        this.currentSvcTpls.splice(i, 1)
        var tmp = this.checkedSvcTpls.indexOf(v)
        if (tmp !== -1) {
          this.checkedSvcTpls.splice(tmp, 1)
        }
      }
    },
    createData() {
      this.ruleForm = {}
      this.dialogVisible = {
        title: '新建集群模板',
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
        title: '编辑集群模板',
        status: 'edit',
        dialog: true
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    deleteData(id) {
      this.$confirm('是否删除此集群模板?', '提示', {
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
    },
    addSvcTplDialog() {
      this.innerVisible = {
        title: '绑定服务模型',
        dialog: true,
        status: 'create'
      }
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

  /deep/ .el-checkbox {
    margin-right: 0;
  }
</style>
