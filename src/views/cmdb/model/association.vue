<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <!-- 提示 -->
        <div style="margin-bottom: 13px;">
          <el-alert
            title="“关联类型”是模型关联的分类，如主机于交换机、路由之间的关系都可以分类为“上联”类型。"
            type="info"
            show-icon
          />
        </div>
        <!-- 操作 -->
        <div>
          <el-row>
            <el-button size="mini" type="primary" @click="addAssociation">新建</el-button>
            <el-input
              v-model="queryParams.search"
              size="mini"
              placeholder="请输入内容"
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
              prop="id"
              label="ID"
            />
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
              <template slot-scope="scope">
                <el-link
                  icon="el-icon-delete"
                  type="primary"
                  :underline="false"
                  style="margin-left: 15px;"
                  @click="uniqueFieldDelete(scope.row.id)"
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

      <!-- 新建/编辑关联类型 -->
      <el-dialog
        :title="relatedType.title"
        :visible.sync="relatedType.dialog"
        width="30%"
      >
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="110px">
          <el-form-item label="唯一标识" prop="identifies">
            <el-input v-model="ruleForm.identifies" size="small" />
          </el-form-item>
          <el-form-item label="字段名称" prop="name">
            <el-input v-model="ruleForm.name" size="small" />
          </el-form-item>
          <el-form-item label="源->目标描述" prop="source_describe">
            <el-input v-model="ruleForm.source_describe" size="small" />
          </el-form-item>
          <el-form-item label="目标->源描述" prop="target_describe">
            <el-input v-model="ruleForm.target_describe" size="small" />
          </el-form-item>
          <el-form-item label="是否有方向" prop="direction" size="small">
            <el-radio-group v-model="ruleForm.direction">
              <el-radio :label="1">有，源指向目标</el-radio>
              <el-radio :label="2">双向</el-radio>
              <el-radio :label="3">无方向</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="relatedType.dialog = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </el-dialog>

    </template>
  </BasicLayout>
</template>

<script>
import {
  createAssociationType,
  associationTypeList
} from '@/api/cmdb/model'
export default {
  components: {

  },
  data() {
    var validateIdentifies = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('格式不正确，请填写英文开头，下划线，数字，英文的组合'))
      }
    }
    return {
      relatedType: {},
      loading: false,
      list: [],
      total: 0,
      queryParams: {
        page: 1,
        per_page: 10
      },
      ruleForm: {
        direction: 1
      },
      rules: {
        identifies: [
          { required: true, message: '请输入唯一标识', trigger: 'blur' },
          { validator: validateIdentifies, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入字段名称', trigger: 'blur' }
        ],
        source_describe: [
          { required: true, message: '请输入源->目标描述', trigger: 'blur' }
        ],
        target_describe: [
          { required: true, message: '请输入目标->源描述', trigger: 'blur' }
        ],
        direction: [
          { required: true, message: '请请选方向', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      associationTypeList().then(res => {
        console.log(res.data)
        this.list = res.data.list
        this.total = res.data.total_count
      })
    },
    addAssociation() {
      this.relatedType = {
        title: '新建关联',
        status: 'create',
        dialog: true
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          createAssociationType(this.ruleForm).then(res => {
            console.log(res)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .group-title-before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 14px;
    vertical-align: middle;
    margin: 0px 10px 0px 0px;
    background: rgb(195, 205, 215);
  }

  .model-info-div {
    width: calc(20% - 14px);
    height: 70px;
    border: 1px solid rgb(221, 228, 235);;
    border-radius: 4px;
    margin-left: 14px;
    margin-top: 12px;
    cursor: pointer;
    display: inline-block;
  }

  .model-info-icon {
    float: left;
    width: 66px;
    text-align: center;
    font-size: 32px;
    color: #3a84ff;
    line-height: 68px;
  }

  .model-info-details-title {
    margin-top: 16px;
    line-height: 19px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .model-info-details-remarks {
    line-height: 16px;
    font-size: 12px;
    color: #bfc7d2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .group-operate-icon {
    margin-left: 10px;
    font-size: 15px;
    color: rgb(51, 57, 72);
    cursor: pointer;
  }
</style>
