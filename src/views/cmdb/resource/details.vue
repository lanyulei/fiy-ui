<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>资源详情</span>
        </div>
        <div>
          <div v-for="field_groups of fields.field_groups" :key="field_groups.id" class="group">
            <div class="group-name">{{ field_groups.name }}</div>
            <ul class="property-list">
              <li v-for="field of field_groups.fields" id="property-item-1" :key="field.id" class="property-item">
                <span class="property-name" tabindex="0">
                  {{ field.name }} :
                </span>
                <span class="property-value" tabindex="0">
                  <span class="value-default-theme">{{ fieldForm[field.identifies] }}</span>
                </span>
                <div class="copy-box">
                  <i class="property-copy icon-cc-details-copy" />
                </div>
              </li>
            </ul>
          </div>
          <div v-if="relatedFileds.length > 0" class="group">
            <div class="group-name">关联数据</div>
            <template v-for="(item, index) in relatedFileds">
              <div v-if="relatedModelData[item.identifies].length > 0" :key="index" class="property-list-associate">
                <span class="property-name" tabindex="0">
                  {{ item.name }}，数量: {{ relatedModelData[item.identifies].length }}:
                </span>
                <el-table
                  v-loading="loading"
                  :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                  size="mini"
                  :data="relatedModelData[item.identifies]"
                  border
                  style="margin-top: 12px;"
                >
                  <template v-for="field of item.fields">
                    <el-table-column
                      v-if="field.is_list_display"
                      :key="field.id"
                      :prop="field.identifies"
                      :label="field.name"
                    />
                  </template>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="60"
                  >
                    <template slot-scope="{row}">
                      <el-button type="text" size="small" @click="handleDeleteRelated(row.related_id)">解绑</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </div>
        </div>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  modelDetails,
  relatedInfoFields
} from '@/api/cmdb/model'

import {
  dataDetails,
  deleteDataRelated
} from '@/api/cmdb/resource'
export default {
  data() {
    return {
      fields: {},
      fieldForm: {},
      relatedFileds: [],
      relatedModelData: {},
      list: [],
      loading: false
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      this.getModelDetailsForm()

      relatedInfoFields(this.$route.query.info_id, { data_id: this.$route.query.id }).then(res => {
        this.relatedFileds = res.data.fields
        this.relatedModelData = res.data.data
      })
    },
    getModelDetails() {
      dataDetails(this.$route.query.id).then(res => {
        this.fieldForm = res.data.data
      })
    },
    getModelDetailsForm() {
      modelDetails(this.$route.query.info_id).then(res => {
        this.fields = res.data
        this.getModelDetails()
      })
    },
    handleDeleteRelated(id) {
      this.$confirm('是否删除此条数据关联?', '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        deleteDataRelated(id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.initForm()
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

<style scoped>
  .group .group-name:before {
    content: "";
    display: inline-block;
    vertical-align: -2px;
    width: 4px;
    height: 14px;
    margin-right: 9px;
    margin-top: 10px;
    background-color: #c3cdd7;
  }

  .group .group-name {
    line-height: 21px;
    font-size: 16px;
    font-weight: normal;
    color: #333948;
  }

  .property-list {
    width: 80%;
    color: #63656e;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-bottom: 0;
  }

  .property-list-associate {
    color: #63656e;
    font-size: 14px;
    margin-top: 20px;
    padding-left: 14px;
  }

  .property-list .property-item {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
    padding-bottom: 8px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }

  .property-list .property-item .property-name {
    position: relative;
    /* width: 150px; */
    line-height: 32px;
    padding: 0 16px 0 0;
    font-size: 14px;
    color: #63656E;
    /* overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
  }

  .property-list .property-item .property-value {
    margin: 6px 0 0 4px;
    max-width: 75%;
    font-size: 14px;
    color: #313237;
    /* overflow: hidden; */
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    /* -webkit-line-clamp: 2; */
    -webkit-box-orient: vertical;
  }

  ul, dl {
    list-style: none;
  }
</style>
