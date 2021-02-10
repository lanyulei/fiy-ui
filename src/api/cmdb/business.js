import request from '@/utils/request'

// 新建分组
export function createServiceClassify(data) {
  return request({
    url: '/api/v1/cmdb/business/service-classify',
    method: 'post',
    data
  })
}

// 服务分类列表
export function serviceClassifyList() {
  return request({
    url: '/api/v1/cmdb/business/service-classify',
    method: 'get'
  })
}

// 服务分类列表
export function deleteServiceClassify(id, params) {
  return request({
    url: `/api/v1/cmdb/business/service-classify/${id}`,
    method: 'delete',
    params
  })
}

// 服务分类列表
export function editServiceClassify(id, data) {
  return request({
    url: `/api/v1/cmdb/business/service-classify/${id}`,
    method: 'put',
    data
  })
}

