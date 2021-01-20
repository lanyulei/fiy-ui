import request from '@/utils/request'

// 获取验证码
export function createModelGroup(data) {
  return request({
    url: '/api/v1/cmdb/model/group',
    method: 'post',
    data
  })
}

// 获取模型列表
export function modelList(params) {
  return request({
    url: '/api/v1/cmdb/model/group',
    method: 'get',
    params
  })
}

// 编辑模型分组
export function editModelGroup(groupId, data) {
  return request({
    url: `/api/v1/cmdb/model/group/${groupId}`,
    method: 'put',
    data
  })
}

// 删除模型分组
export function deleteModelGroup(groupId) {
  return request({
    url: `/api/v1/cmdb/model/group/${groupId}`,
    method: 'delete'
  })
}

// 创建模型
export function createModelInfo(data) {
  return request({
    url: `/api/v1/cmdb/model/info`,
    method: 'post',
    data
  })
}

// 创建模型字段
export function createModelFieldGroup(data) {
  return request({
    url: `/api/v1/cmdb/model/field/group`,
    method: 'post',
    data
  })
}

// 获取模型详情
export function modelDetails(modelId) {
  return request({
    url: `/api/v1/cmdb/model/details/${modelId}`,
    method: 'get'
  })
}
