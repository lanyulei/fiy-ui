<template>
  <div>
    <el-button size="small" type="primary" style="margin-bottom: 13px">新建校验</el-button>
    <el-table
      border
      :data="tableUniqueData"
      style="width: 100%"
    >
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
        label="属性为空值时是否校验"
      >
        <template>是</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-link
            icon="el-icon-edit"
            type="primary"
            :underline="false"
            @click="uniqueFieldEdit(scope.$index, scope.row)"
          >编辑</el-link>
          <el-link
            icon="el-icon-delete"
            type="primary"
            :underline="false"
            style="margin-left: 15px;"
            @click="uniqueFieldDelete(scope.$index, scope.row)"
          >删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  getUniqueFields
} from '@/api/cmdb/model'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['modelId'],
  data() {
    return {
      tableUniqueData: []
    }
  },
  methods: {
    getUniqueFieldsHandle() {
      getUniqueFields(this.modelId).then(res => {
        this.tableUniqueData = res.data
      })
    },
    uniqueFieldEdit() {},
    uniqueFieldDelete() {}
  }
}
</script>

<style scoped>

</style>
