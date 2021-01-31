<template>
  <BasicLayout>
    <template #wrapper>
      <el-row>
        <el-col v-for="(item, index) in groupModelList" :key="index" :span="6">
          <div
            :style="(index + 1) % 4 === 0 ? {} : {'margin-right': '10px'}"
            style="margin-bottom: 10px"
          >
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>{{ item.name }}</span>
              </div>
              <div>
                <div
                  v-for="(modelItem, modelIndex) in item.model_list"
                  :key="modelIndex"
                  class="models-link"
                  @click="toModelDetails(modelItem.identifies)"
                >

                  <span class="model-name">
                    <i
                      :class="modelItem.icon"
                      style="color: rgb(58, 132, 255); margin-right: 6px; font-size: 16px;"
                    />
                    {{ modelItem.name }}
                  </span>
                  <span class="model-instance-count" style="float: right;">0</span>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </template>
  </BasicLayout>
</template>

<script>
import {
  modelList
} from '@/api/cmdb/model'
export default {
  components: {

  },
  data() {
    return {
      groupModelList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      modelList({
        isUsable: 1
      }).then(res => {
        this.groupModelList = res.data
      })
    },
    toModelDetails(identifies) {
      this.$router.push({ name: 'ResourceDetails', params: { classify: identifies }})
    }
  }
}
</script>

<style scoped>
  .models-link {
    padding: 7px 3px 0 3px;
    display: block;
    position: relative;
    cursor: pointer;
    height: 38px;
  }

  .models-link:hover {
    background-color: #e5f2ff;
  }

  .model-name {
    display: inline-block;
    max-width: calc(100% - 80px);
    font-size: 14px;
    line-height: 24px;
    color: rgb(99, 101, 110);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .model-instance-count {
    width: 35px;
    font-size: 14px;
    line-height: 24px;
    color: rgb(196, 198, 204);
    text-align: right;
    display: inline-block;
    vertical-align: middle;
  }
</style>
