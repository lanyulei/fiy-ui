import request from '@/utils/request'

export function versionList() {
  return request({
    url: '/api/v1/k8s/version',
    method: 'get'
  })
}
