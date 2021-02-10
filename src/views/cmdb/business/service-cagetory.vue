<template>
  <BasicLayout>
    <template #wrapper>
      <div class="service-cagetory-list">
        <el-alert
          style="background: #F0F8FF; color: #63656E; margin-bottom: 12px;"
          title="服务分类可以帮助业务梳理服务用途。配置平台初始化包含一些常见的分类，并支持根据业务拓展更多分类。"
          type="info"
          show-icon
        />
        <div class="category-list">
          <template v-for="(gItem, gIndex) in list">
            <div :key="gIndex" class="category-item bgc-white">
              <div class="category-title" style="background-color: #fafbfd;">
                <div class="category-name">
                  <span
                    title="数据库"
                    class="category-name-text"
                  >{{ gItem.name }}
                    <i class="el-icon-edit category-name-icon" @click="editService(gItem)" />
                    <i
                      v-if="gItem.services === undefined || gItem.services === null || gItem.services.length === 0"
                      class="el-icon-delete category-name-icon"
                      @click="deleteData(gItem.id, gItem.level)"
                    />
                  </span>
                </div>
                <span style="cursor: pointer;" @click="createService(gItem.id)">
                  <i class="el-icon-plus" />
                </span>
              </div>
              <div class="child-category">
                <template v-if="gItem.services !== undefined && gItem.services !== null && gItem.services.length > 0">
                  <div v-for="(sItem, sIndex) in gItem.services" :key="sIndex" class="child-item is-built-in">
                    <div class="child-title">
                      <span>
                        {{ sItem.name }}
                        <i class="el-icon-edit category-name-icon" @click="editService(sItem)" />
                        <i class="el-icon-delete category-name-icon" @click="deleteData(sItem.id, sItem.level)" />
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
          <div
            class="category-item add-item"
            style="border-style: dashed; cursor: pointer;"
            @click="createGroupTitle"
          >
            <div
              class="category-title"
              style="border-bottom-style: dashed;"
            />
            <div class="child-category" />
            <span
              type="button"
              class="add-btn"
            />
          </div>

        </div>
      </div>

      <!-- 创建/编辑 -->
      <el-dialog
        :title="dialogVisible.title"
        :visible.sync="dialogVisible.dialog"
        width="30%"
      >
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
          <el-form-item label="唯一标识" prop="identifies">
            <el-input v-model="ruleForm.identifies" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible.dialog = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </BasicLayout>
</template>

<script>
import {
  createServiceClassify,
  serviceClassifyList,
  deleteServiceClassify,
  editServiceClassify
} from '@/api/cmdb/business'
export default {
  components: {

  },
  data() {
    var validateIdentifies = (rule, value, callback) => {
      const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('必须是英文开头，仅包含英文、数字及下划线'))
      }
    }
    return {
      list: [],
      dialogVisible: {},
      ruleForm: {},
      rules: {
        identifies: [
          { required: true, message: '请输入唯一标识', trigger: 'blur' },
          { validator: validateIdentifies, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      serviceClassifyList().then(res => {
        this.list = res.data
      })
    },
    deleteData(id, level) {
      this.$confirm('是否删除此服务分类?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteServiceClassify(id, {
          level: level
        }).then(() => {
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
    createGroupTitle() {
      this.ruleForm = {}
      this.dialogVisible = {
        title: '新建分组',
        status: 'group',
        dialog: true
      }
      this.ruleForm.level = 1
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    createService(id) {
      this.ruleForm = {}
      this.dialogVisible = {
        title: '新建服务分类',
        status: 'create',
        dialog: true
      }
      this.ruleForm.level = 2
      this.ruleForm.parent = id
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    editService(row) {
      this.ruleForm = row
      this.dialogVisible = {
        status: 'edit',
        dialog: true
      }

      if (this.ruleForm.level === 1) {
        this.dialogVisible.title = '编辑分组'
      } else if (this.ruleForm.level === 2) {
        this.dialogVisible.title = '编辑服务分类'
      }

      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.dialogVisible.status === 'group' || this.dialogVisible.status === 'create') {
            createServiceClassify(this.ruleForm).then(() => {
              this.getList()
              this.$message({
                type: 'success',
                message: '新建成功'
              })
            })
          } else if (this.dialogVisible.status === 'edit') {
            editServiceClassify(this.ruleForm.id, {
              identifies: this.ruleForm.identifies,
              name: this.ruleForm.name
            }).then(() => {
              this.getList()
              this.$message({
                type: 'success',
                message: '编辑成功'
              })
            })
          }
          this.dialogVisible.dialog = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .category-list {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-flow: row wrap;
    flex-flow: row wrap;
  }

  .category-item:nth-child(4n+1) {
      margin-left: 0;
  }

  .category-item {
    position: relative;
    -webkit-box-flex: 0;
    -ms-flex: 0 0 calc(25% - 15px);
    flex: 0 0 calc(25% - 15px);
    border: 1px solid #dcdee5;
    margin-left: 20px;
    margin-bottom: 20px;
    overflow: hidden;
  }

  .bgc-white {
    background-color: #fff;
  }

  .category-title {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: 0 16px 0 16px;
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    color: #63656e;
    font-weight: bold;
    border-bottom: 1px solid #dcdee5;
  }

  .category-title .category-name {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    width: 100%;
    padding-right: 20px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .category-title .category-name .category-name-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .child-category {
    height: 280px;
    padding: 0 10px 10px 38px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .child-category .child-item:first-child {
    padding-top: 14px;
  }

  .child-category .child-item {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    z-index: 10;
    line-height: 32px;
  }

  .child-category .child-item .child-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    color: #63656e;
    font-size: 14px;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    padding-right: 20px;
    padding-left: 16px;
    margin-left: 10px;
  }

  .child-category .child-item .child-title>span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 10px;
  }

  .child-category .child-item:first-child::after {
    height: 30px;
    top: 0px;
  }

  .child-category .child-item::after {
    content: '';
    position: absolute;
    top: -15px;
    left: -20px;
    display: block;
    width: 30px;
    height: 32px;
    border-bottom: 1px solid #dcdee5;
    border-left: 1px solid #dcdee5;
    z-index: -1;
  }

  .category-item.add-item .add-btn::after, .category-item.add-item .add-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 3px;
    background-color: #3a84ff;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .category-item.add-item .add-btn::before {
    width: 3px;
    height: 20px;
  }

  .category-name-icon {
    margin-left: 10px;
    cursor: pointer;
  }
</style>
