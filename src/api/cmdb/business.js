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

// 新建服务模板
export function createSvcTpl(data) {
  return request({
    url: `/api/v1/cmdb/business/svc-tpl`,
    method: 'post',
    data
  })
}

// 服务模板列表
export function svcTplList(params) {
  return request({
    url: `/api/v1/cmdb/business/svc-tpl`,
    method: 'get',
    params
  })
}

// 服务模板详情
export function svcTplDetails(id) {
  return request({
    url: `/api/v1/cmdb/business/svc-tpl/${id}`,
    method: 'get'
  })
}

// 删除服务模板
export function deleteSvcTpl(id) {
  return request({
    url: `/api/v1/cmdb/business/svc-tpl/${id}`,
    method: 'delete'
  })
}

// 新建进程
export function createSvcTplProcess(data) {
  return request({
    url: `/api/v1/cmdb/business/svc-tpl-process`,
    method: 'post',
    data
  })
}

// 编辑进程
export function editSvcTplProcess(id, data) {
  return request({
    url: `/api/v1/cmdb/business/svc-tpl-process/${id}`,
    method: 'put',
    data
  })
}

// 删除进程
export function deleteSvcTplProcess(id) {
  return request({
    url: `/api/v1/cmdb/business/svc-tpl-process/${id}`,
    method: 'delete'
  })
}

