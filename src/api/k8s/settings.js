import request from '@/utils/request'

// 新建仓库信息
export function createRegistry(data) {
  return request({
    url: '/api/v1/k8s/settings/registry',
    method: 'post',
    data
  })
}

// 编辑仓库信息
export function editRegistry(id, data) {
  return request({
    url: `/api/v1/k8s/settings/registry/${id}`,
    method: 'put',
    data
  })
}

// 仓库信息列表
export function registryList(params) {
  return request({
    url: `/api/v1/k8s/settings/registry`,
    method: 'get',
    params
  })
}

// 删除仓库信息
export function deleteRegistry(id) {
  return request({
    url: `/api/v1/k8s/settings/registry/${id}`,
    method: 'delete'
  })
}

// 新建凭据
export function createCredential(data) {
  return request({
    url: '/api/v1/k8s/settings/credential',
    method: 'post',
    data
  })
}

// 编辑凭据
export function editCredential(id, data) {
  return request({
    url: `/api/v1/k8s/settings/credential/${id}`,
    method: 'put',
    data
  })
}

// 凭据列表
export function credentialList(params) {
  return request({
    url: `/api/v1/k8s/settings/credential`,
    method: 'get',
    params
  })
}

// 删除凭据
export function deleteCredential(id) {
  return request({
    url: `/api/v1/k8s/settings/credential/${id}`,
    method: 'delete'
  })
}

// 获取NTP服务
export function getNTPServer() {
  return request({
    url: `/api/v1/k8s/settings/ntp`,
    method: 'get'
  })
}

// 保存NTP服务
export function saveNTPServer(data) {
  return request({
    url: `/api/v1/k8s/settings/ntp`,
    method: 'post',
    data
  })
}
