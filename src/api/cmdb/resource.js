import request from '@/utils/request'

// 新建数据
export function createData(data) {
  return request({
    url: '/api/v1/cmdb/resource',
    method: 'post',
    data
  })
}

// 数据列表
export function getDataList(modelId, params) {
  return request({
    url: `/api/v1/cmdb/resource/data/${modelId}`,
    method: 'get',
    params
  })
}

// 删除数据
export function deleteData(modelId) {
  return request({
    url: `/api/v1/cmdb/resource/data/${modelId}`,
    method: 'delete'
  })
}

// 编辑数据
export function editData(modelId, data) {
  return request({
    url: `/api/v1/cmdb/resource/data/${modelId}`,
    method: 'put',
    data
  })
}

// 编辑数据
export function dataDetails(id) {
  return request({
    url: `/api/v1/cmdb/resource/detail/${id}`,
    method: 'get'
  })
}
