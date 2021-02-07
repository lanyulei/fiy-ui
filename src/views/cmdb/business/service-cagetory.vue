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
          <div class="category-item bgc-white">
            <div class="category-title">
              <div class="category-name">
                <span
                  title="数据库"
                  class="category-name-text"
                >数据库</span>
                <span class="built-in-sign">内置</span>
              </div>
            </div>
            <div class="child-category">
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>Etcd</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>MongoDB</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>Mysql</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>Oracle</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>Redis</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>SQLServer</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>Zookeeper</span>
                </div>
              </div>
            </div>
          </div>
          <div class="category-item bgc-white">
            <div class="category-title">
              <div class="category-name">
                <span
                  title="数据库"
                  class="category-name-text"
                >数据库</span>
                <span class="built-in-sign">内置</span>
              </div>
            </div>
            <div class="child-category">
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>Etcd</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>MongoDB</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>Mysql</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>Oracle</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>Redis</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>SQLServer</span>
                </div>
              </div>
              <div class="child-item is-built-in">
                <div class="child-title">
                  <span>Zookeeper</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </template>
  </BasicLayout>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .service-cagetory-list {
    padding: 10px;
  }

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
    background-color: #fafbfd;
    padding: 0 20px 0 16px;
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
</style>
