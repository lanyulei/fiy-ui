import request from '@/utils/request'

// 审计历史
export function getAuditList(params) {
  return request({
    url: '/api/v1/cmdb/analysis',
    method: 'get',
    params
  })
}

// 详情
export function getAuditDetails(id) {
  return request({
    url: `/api/v1/cmdb/analysis/details/${id}`,
    method: 'get',
    id
  })
}

// 运营统计
export function getOperation() {
  return request({
    url: `/api/v1/cmdb/analysis/operation`,
    method: 'get'
  })
}
