<template>
  <div v-loading.fullscreen.lock="loading" class="search-div">
    <div class="search-value">
      <el-input v-model="listQuery.value" placeholder="请输入资源内容" class="input-with-select" @keyup.enter.native="handleSearch">
        <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
      </el-input>
      <el-collapse-transition>
        <div v-show="dataShow" style="background-color: #fff">
          <div v-if="listQuery.value !== ''" class="dataTotal">
            共搜索 <span style="color: #000">{{ total }}</span> 条数据
          </div>
          <template v-for="(item, index) in list">
            <div
              :key="item.id"
              :style="list.length - 1 !== index ? {'border-bottom': '1px solid #ccc'} : {}"
              style="cursor: pointer;"
              @click="getDataDetails(item)"
            >
              <div class="transition-box">
                <div style="font-size: 14px;">
                  <span style="color: #63656E;">数据ID：</span>{{ item.id }}
                  <span style="color: #63656E; margin-left: 20px;">模型ID：</span>{{ item.info_id }}
                  <span style="color: #63656E; margin-left: 20px;">模型名称：</span>{{ item.info_name }}
                </div>
                <div style="margin-top: 10px; font-size: 14px;">
                  <span style="color: #63656E;">数据：</span>
                  <span v-for="(dataItem, dataIndex) in item.data" :key="dataIndex">
                    <el-tag size="mini" style="color: #000; margin-right: 5px;">{{ dataItem }}</el-tag>
                  </span>
                </div>
              </div>
            </div>
          </template>
          <div v-if="total > 0 && total > list.length" class="moreData">
            <span style="cursor: pointer;" @click="moreData">更多数据</span>
          </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import {
  getData
} from '@/api/cmdb/search'
export default {
  components: {
  },
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      dataShow: false,
      stypeColor: '#999',
      listQuery: {
        page: 0,
        limit: 10,
        value: ''
      }
    }
  },
  methods: {
    handleGet() {
      if (this.listQuery.value !== '') {
        this.loading = true
        getData(this.listQuery).then(res => {
          if (res.data.list) {
            for (var l of res.data.list) {
              this.list.push(l)
            }
            this.total = res.data.total
          }
          setTimeout(() => {
            this.dataShow = true
            this.loading = false
          }, 600)
        }).catch(() => {
          setTimeout(() => {
            this.loading = false
          }, 600)
        })
      } else {
        this.$message({
          type: 'warning',
          message: '搜索数据不能空!'
        })
      }
    },
    handleSearch() {
      this.listQuery.page = 0
      this.listQuery.limit = 1
      this.list = []
      this.total = 0
      this.handleGet()
    },
    moreData() {
      this.listQuery.page += 1
      this.listQuery.limit += 10
      this.handleGet()
    },
    getDataDetails(item) {
      this.$router.push({ path: '/cmdb/resource/details', query: { 'info_id': item.info_id, 'id': item.id }})
    }
  }
}
</script>

<style lang="scss" scoped>
  .lizi {
    position:fixed;
    width: 100%;
  }

  .search-value {
    position: relative;
    top: 150px;
    border-radius: 4px;
    margin: 0 auto;
    width: 880px;
    -webkit-box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
    box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
    margin-bottom: 230px;
  }

  /deep/ .input-with-select .el-input__inner {
    height: 46px;
  }

  .input-with-select {
    font-size: 20px;
  }

  .transition-box {
    padding: 15px;
  }

  .dataTotal {
    border-bottom: 1px solid #ccc;
    color: #63656E;
    font-size: 13px;
    padding: 8px 15px;
  }

  .moreData {
    text-align: center;
    color: #999;
    padding-top: 20px;
    padding-bottom: 20px;
    font-size: 18px;
    font-style: italic;
    border-top: 1px solid #ccc;
  }
</style>
