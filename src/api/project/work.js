import request from '@/utils/request'

// 查询项目日报列表
export function listWork(query) {
  return request({
    url: '/emp/project/work/list',
    method: 'get',
    params: query
  })
}

// 查询项目日报详细
export function getWork(id) {
  return request({
    url: '/emp/project/work/' + id,
    method: 'get'
  })
}

// 新增项目日报
export function addWork(data) {
  return request({
    url: '/emp/project/work',
    method: 'post',
    data: data
  })
}

// 修改项目日报
export function updateWork(data) {
  return request({
    url: '/emp/project/work',
    method: 'put',
    data: data
  })
}

// 删除项目日报
export function delWork(id) {
  return request({
    url: '/emp/project/work/' + id,
    method: 'delete'
  })
}

// 导出项目日报
export function exportWork(query) {
  return request({
    url: '/emp/project/work/export',
    method: 'get',
    params: query
  })
}

//项目信息下拉框
export function projectAll(query) {
  return request({
    url: '/emp/project/projectInfo/getAll',
    method: 'get',
    params: query
  })
}

//项目进展-日报审批 
export function approvalWork(query) {
  return request({
    url: '/emp/project/work/review',
    method: 'get',
    params: query
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
