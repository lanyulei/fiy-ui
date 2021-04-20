import request from '@/utils/request'

// 创建项目
export function createProject(data) {
  return request({
    url: '/api/v1/k8s/project',
    method: 'post',
    data
  })
}

// 项目列表
export function projectList(params) {
  return request({
    url: '/api/v1/k8s/project',
    method: 'get',
    params
  })
}

// 编辑项目
export function editProject(id, data) {
  return request({
    url: `/api/v1/k8s/project/${id}`,
    method: 'put',
    data
  })
}

// 删除项目
export function deleteProject(id) {
  return request({
    url: `/api/v1/k8s/project/${id}`,
    method: 'delete'
  })
}
