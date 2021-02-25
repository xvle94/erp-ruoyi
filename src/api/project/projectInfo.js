import request from '@/utils/request'

// 查询项目信息列表
export function listProjectInfo(query) {
  return request({
    url: '/emp/project/projectInfo/list',
    method: 'get',
    params: query
  })
}

// 查询项目信息详细
export function getProjectInfo(id) {
  return request({
    url: '/emp/project/projectInfo/' + id,
    method: 'get'
  })
}

// 新增项目信息
export function addProjectInfo(data) {
  return request({
    url: '/emp/project/projectInfo',
    method: 'post',
    data: data
  })
}

// 修改项目信息
export function updateProjectInfo(data) {
  return request({
    url: '/emp/project/projectInfo',
    method: 'put',
    data: data
  })
}

// 删除项目信息
export function delProjectInfo(id) {
  return request({
    url: '/emp/project/projectInfo/' + id,
    method: 'delete'
  })
}

// 文件上传
export function uploadFile(data) {
  return request({
    url: '/common/shiYue/upload',
    method: 'post',
    data: data
  })
}

// 查询所有客户信息
export function getCustomerAll() {
  return request({
    url: '/emp/ozrs/customer/getAll',
    method: 'get'
  })
}

// 导出项目详情单
export function exportInfo(data) {
  return request({
    url: '/emp/project/projectInfo/export/infoWord',
    method: 'get',
    params: data
  })
}

// 根据流程实例id查询最新流程历史
export function getProcessHistory(query) {
  return request({
    url: '/emp/approval/process/history',
    method: 'get',
    params: query
  })
}

// 导出项目回款
export function exportsInfo(query) {
  return request({
    url: '/emp/project/projectInfo/exports',
    method: 'get',
    params: query
  })
}

// 项目验收-根据项目id得到项目验收信息
export function getAcceptInfo(query) {
  return request({
    url: '/emp/project/accept/query/by/projectId',
    method: 'get',
    params: query
  })
}

// 项目验收-保存项目验收信息
export function conserveAcceptInfo(data) {
  return request({
    url: '/emp/project/accept',
    method: 'put',
    data: data
  })
}