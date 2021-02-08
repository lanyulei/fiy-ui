import request from '@/utils/request'

// 新建分组
export function createServiceClassify(data) {
  return request({
    url: '/api/v1/cmdb/business',
    method: 'post',
    data
  })
}

// 服务分类列表
export function serviceClassifyList() {
  return request({
    url: '/api/v1/cmdb/business',
    method: 'get'
  })
}

