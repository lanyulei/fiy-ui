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

        </div>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  modelDetails
} from '@/api/cmdb/model'

import {
  dataDetails
} from '@/api/cmdb/resource'
export default {
  data() {
    return {
      fields: {},
      fieldForm: {}
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      this.getModelDetailsForm()
    },
    getModelDetails() {
      dataDetails(this.$route.params.id).then(res => {
        this.fieldForm = res.data.data
      })
    },
    getModelDetailsForm() {
      modelDetails(this.$route.query.fieldId).then(res => {
        this.fields = res.data
        this.getModelDetails()
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
