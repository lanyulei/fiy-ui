import request from '@/utils/request'

// 获取验证码
export function createData(data) {
  return request({
    url: '/api/v1/cmdb/resource',
    method: 'post',
    data
  })
}
