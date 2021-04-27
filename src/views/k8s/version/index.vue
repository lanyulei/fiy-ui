<template>
  <BasicLayout>
    <template #wrapper>
      <el-row>
        <el-col
          v-for="(item, index) in list"
          :key="item.id"
          :span="6"
        >
          <el-card
            class="box-card"
            :style="index + 1 % 4 === 0 ? {} : {marginRight: '10px'}"
            style="margin-bottom: 10px;"
          >
            <div slot="header" class="clearfix">
              <span>{{ item.name }}</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="handleClick(item)">详情</el-button>
            </div>
            <div>
              <ul>
                <li
                  v-for="(coreItem, coreIndex) in item.core"
                  :key="coreIndex"
                  style="margin-bottom: 10px; color: #666666"
                >
                  {{ coreItem.name }}: {{ coreItem.version }}
                </li>
              </ul>
              <div style="text-align: right;">
                <el-switch v-model="item.is_active" />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-dialog
        class="k8s-version-details"
        title="详情"
        :visible.sync="dialogVisible"
        width="50%"
      >
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
      </el-dialog>
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
      dialogVisible: false,
      list: [],
      details: {}
    }
  },
  created() {
    versionList().then(res => {
      this.list = res.data
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
  /deep/ .k8s-version-details .el-dialog {
    margin-top: 123vh !important;
  }

  /deep/ .k8s-version-details .el-divider__text {
    font-size: 16px;
  }
</style>
