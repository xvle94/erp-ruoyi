import request from '@/utils/request'

// 查询合同管理列表
export function listContract(query) {
  return request({
    url: '/emp/project/contract/list',
    method: 'get',
    params: query
  })
}

// 查询合同管理详细
export function getContract(id) {
  return request({
    url: '/emp/project/contract/' + id,
    method: 'get'
  })
}

// 新增合同管理
export function addContract(data) {
  return request({
    url: '/emp/project/contract',
    method: 'post',
    data: data
  })
}

// 修改合同管理
export function updateContract(data) {
  return request({
    url: '/emp/project/contract',
    method: 'put',
    data: data
  })
}

// 删除合同管理
export function delContract(id) {
  return request({
    url: '/emp/project/contract/' + id,
    method: 'delete'
  })
}

// 导出合同管理
export function exportContract(query) {
  return request({
    url: '/emp/project/contract/export',
    method: 'get',
    params: query
  })
}

//客户信息下拉框
export function customerInfo(query) {
  return request({
    url: '/emp/ozrs/customer/getAll',
    method: 'get',
    params: query
  })
}

//项目信息下拉框
export function projectInfo(query) {
  return request({
    url: '/emp/project/projectInfo/getAll',
    method: 'get',
    params: query
  })
}

//上传文件
export function uploadFile(data) {
  return request({
    url: '/common/shiYue/upload',
    method: 'post',
    data: data
  })
}
