import request from '@/utils/request'

// 新建数据
export function getData(params) {
  return request({
    url: '/api/v1/cmdb/search',
    method: 'get',
    params
  })
}
