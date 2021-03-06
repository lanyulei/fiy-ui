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

// 获取模型分组列表
export function getModelGroupList() {
  return request({
    url: `/api/v1/cmdb/model/group-list`,
    method: 'get'
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

// 删除模型
export function deleteModelInfo(modelId) {
  return request({
    url: `/api/v1/cmdb/model/info/${modelId}`,
    method: 'delete'
  })
}

// 创建模型字段
export function createModelFieldGroup(data) {
  return request({
    url: `/api/v1/cmdb/model/field-group`,
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

// 获取模型字段列表
export function modelFields(modelId) {
  return request({
    url: `/api/v1/cmdb/model/fields/${modelId}`,
    method: 'get'
  })
}

// 创建模型字段
export function createModelField(data) {
  return request({
    url: `/api/v1/cmdb/model/field`,
    method: 'post',
    data
  })
}

// 编辑模型字段
export function editModelField(fieldId, data) {
  return request({
    url: `/api/v1/cmdb/model/field/${fieldId}`,
    method: 'put',
    data
  })
}

// 删除字段分组
export function deleteFieldGroup(fieldGroupId) {
  return request({
    url: `/api/v1/cmdb/model/field-group/${fieldGroupId}`,
    method: 'delete'
  })
}

// 编辑字段分组
export function editFieldGroup(fieldGroupId, data) {
  return request({
    url: `/api/v1/cmdb/model/field-group/${fieldGroupId}`,
    method: 'put',
    data
  })
}

// 编辑模型信息
export function editModelInfo(modelId, data) {
  return request({
    url: `/api/v1/cmdb/model/info/${modelId}`,
    method: 'put',
    data
  })
}

// 编辑模型信息
export function stopModelInfo(modelId, data) {
  return request({
    url: `/api/v1/cmdb/model/stop/info/${modelId}`,
    method: 'put',
    data
  })
}

// 删除模型字段
export function deleteModelField(fieldId) {
  return request({
    url: `/api/v1/cmdb/model/field/${fieldId}`,
    method: 'delete'
  })
}

// 获取唯一校验的字段
export function getUniqueFields(modelId) {
  return request({
    url: `/api/v1/cmdb/model/unique-field/${modelId}`,
    method: 'get'
  })
}

// 获取唯一校验的字段
export function updateUniqueField(fieldId, params) {
  return request({
    url: `/api/v1/cmdb/model/unique-field/${fieldId}`,
    method: 'put',
    params
  })
}

// 新建关联类型
export function createAssociationType(data) {
  return request({
    url: `/api/v1/cmdb/model/association-type`,
    method: 'post',
    data
  })
}

// 关联类型列表
export function associationTypeList(params) {
  return request({
    url: `/api/v1/cmdb/model/association-type`,
    method: 'get',
    params
  })
}

// 更新关联类型
export function updateAssociationType(associationId, data) {
  return request({
    url: `/api/v1/cmdb/model/association-type/${associationId}`,
    method: 'put',
    data
  })
}

// 删除关联类型
export function deleteAssociationType(associationId) {
  return request({
    url: `/api/v1/cmdb/model/association-type/${associationId}`,
    method: 'delete'
  })
}

// 新建模型关联
export function createModelRelated(data) {
  return request({
    url: `/api/v1/cmdb/model/model-related`,
    method: 'post',
    data
  })
}

// 模型关联列表
export function modelRelatedList(id) {
  return request({
    url: `/api/v1/cmdb/model/model-related/${id}`,
    method: 'get'
  })
}

// 编辑模型关联
export function editModelRelated(id, data) {
  return request({
    url: `/api/v1/cmdb/model/model-related/${id}`,
    method: 'put',
    data
  })
}

// 编辑模型关联
export function deleteModelRelated(id) {
  return request({
    url: `/api/v1/cmdb/model/model-related/${id}`,
    method: 'delete'
  })
}

// 模型关系
export function relatedInfo() {
  return request({
    url: `/api/v1/cmdb/model/related`,
    method: 'get'
  })
}

// 关联的模型字段
export function relatedInfoFields(id, params) {
  return request({
    url: `/api/v1/cmdb/model/related-fields/${id}`,
    method: 'get',
    params
  })
}
