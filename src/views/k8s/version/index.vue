<template>
  <BasicLayout>
    <template #wrapper>
      <div class="k8s-version-div">
        <el-collapse v-model="activeNames">
          <template>
            <div v-for="(item, index) in list" :key="index">
              <el-collapse-item
                v-for="(contentItem, contentKey) in item"
                :key="contentKey"
                :title="contentKey"
                :name="index"
                :style="list.length - 1 === index ? {} : {borderBottom: '1px solid #e6ebf5'}"
              >
                <div style="padding:15px">
                  <el-row>
                    <el-col
                      v-for="(versionItem, versionIndex) in contentItem"
                      :key="versionIndex"
                      :span="6"
                      style="padding: 8px"
                    >
                      <el-card class="box-card">
                        <div slot="header" class="clearfix">
                          <span>{{ versionItem.name }}</span>
                          <el-button style="float: right; padding: 3px 0" type="text" @click="handleClick(versionItem)">详情</el-button>
                        </div>
                        <div>
                          <ul>
                            <li
                              v-for="(coreItem, coreIndex) in versionItem.core"
                              :key="coreIndex"
                              style="margin-bottom: 10px; color: #666666"
                            >
                              {{ coreItem.name }}: {{ coreItem.version }}
                            </li>
                          </ul>
                          <div style="text-align: right;">
                            <el-switch v-model="versionItem.is_active" />
                          </div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </div>
              </el-collapse-item>
            </div>
          </template>
        </el-collapse>
      </div>

      <!-- 详情 -->
      <el-drawer
        size="50%"
        :with-header="false"
        type="primary"
        :visible.sync="dialogVisible"
        direction="rtl"
        :wrapper-closable="false"
      >
        <div>
          <div class="el-drawer-new-sideslider-header">
            <div class="el-drawer-new-sideslider-closer" style="float: left;" @click="dialogVisible = false">
              <i
                class="el-icon-arrow-right"
              />
            </div>
            <div class="el-drawer-new-sideslider-title" style="padding: 0px 0px 0px 50px;">
              详情
            </div>
            <div class="el-drawer-new-slider-content">
              <div>
                <el-divider content-position="left" style="font-size: 16px;">{{ details.name }}</el-divider>
                <el-table
                  :data="details.core"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    prop="name"
                    label="日期"
                  />
                  <el-table-column
                    prop="version"
                    label="姓名"
                  />
                </el-table>
              </div>
              <div style="padding-top: 20px;">
                <el-divider content-position="left">network</el-divider>
                <el-table
                  :data="details.network"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    prop="name"
                    label="日期"
                  />
                  <el-table-column
                    prop="version"
                    label="姓名"
                  />
                </el-table>
              </div>
              <div style="padding-top: 20px;">
                <el-divider content-position="left">tool</el-divider>
                <el-table
                  :data="details.tool"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    prop="name"
                    label="日期"
                  />
                  <el-table-column
                    prop="version"
                    label="姓名"
                  />
                </el-table>
              </div>
              <div style="padding-top: 20px;">
                <el-divider content-position="left">storage</el-divider>
                <el-table
                  :data="details.storage"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    prop="name"
                    label="日期"
                  />
                  <el-table-column
                    prop="version"
                    label="姓名"
                  />
                </el-table>
              </div>
              <div style="padding-top: 20px;">
                <el-divider content-position="left">other</el-divider>
                <el-table
                  :data="details.other"
                  border
                  style="width: 100%"
                >
                  <el-table-column
                    prop="name"
                    label="日期"
                  />
                  <el-table-column
                    prop="version"
                    label="姓名"
                  />
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </el-drawer>
    </template>
  </BasicLayout>
</template>

<script>
import {
  versionList
} from '@/api/k8s/version'
export default {
  components: {

  },
  data() {
    return {
      activeNames: [],
      dialogVisible: false,
      list: [],
      details: {}
    }
  },
  created() {
    versionList().then(res => {
      this.list = res.data
      for (var i in this.list) {
        this.activeNames.push(parseInt(i))
      }
    })
  },
  methods: {
    handleClick(item) {
      this.details = item
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .k8s-version-div {
    padding: 5px;
  }

  /deep/ .k8s-version-details .el-dialog {
    margin-top: 138vh !important;
  }

  /deep/ .k8s-version-details .el-divider__text {
    font-size: 16px;
  }

  /deep/ .k8s-version-div .el-collapse-item__header {
    padding: 0 10px 0 15px;
    font-size: 16px;
    color: #666;
  }

  /deep/ .k8s-version-div .el-collapse-item__header.is-active {
    border-bottom-color: #e6ebf5;
    background-color: #d8e3e9;
  }

  /deep/ .k8s-version-div .el-collapse-item__content {
    padding-bottom: 0;
  }
</style>
