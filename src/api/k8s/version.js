import request from '@/utils/request'

// 创建项目
export function versionList() {
  return request({
    url: '/api/v1/k8s/version',
    method: 'get'
  })
}
