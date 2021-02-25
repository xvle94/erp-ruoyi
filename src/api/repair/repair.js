import request from '@/utils/request'

// 查询维修列表列表
export function listRepair(query) {
  return request({
    url: '/repair/list',
    method: 'get',
    params: query
  })
}

// 查询维修列表详细
export function getRepair(id) {
  return request({
    url: '/repair/getInfoForUpdateIn/' + id,
    method: 'get',
  })
}

// 查询维修列表详情
export function getRepairDetail(id) {
  return request({
    url: '/repair/getInfo/' + id,
    method: 'get',
  })
}

// 新增维修列表
export function addRepair(data) {
  return request({
    url: '/repair/addIn',
    method: 'post',
    data: data
  })
}

// 修改维修列表
export function updateRepair(data) {
  return request({
    url: '/repair/updateIn',
    method: 'put',
    data: data
  })
}

// 删除维修列表
export function delRepair(id) {
  return request({
    url: '/repair/setAbolish/' + id,
    method: 'delete'
  })
}

// 导出维修列表
export function exportRepair(query) {
  return request({
    url: '/repair/listExport',
    method: 'get',
    params: query
  })
}

// 单个导出
export function exportRepairOne(query) {
  return request({
    url: '/repair/exportDetail/'+query,
    method: 'get',
    responseType: 'blob'
  })
}

// 获取客户名称
export function getCustomer(query) {
  return request({
    url: '/emp/ozrs/customer/getAll',
    method: 'get',
    params: query
  })
}

// 获取成本下拉框数据
export function getCost(query) {
  return request({
    url: '/project/cost/getAll',
    method: 'get',
    params: query
  })
}

// 获取成本下拉框数据
export function getAssign(query) {
  return request({
    url: '/system/user/selectUserByRoleKey?roleKey=repair',
    method: 'get',
    params: query
  })
}

// 通过审核
export function passAudit(query) {
  return request({
    url: '/repair/passAudit',
    method: 'post',
    params: query
  })
}

// 不通过审核
export function noPassAudit(query) {
  return request({
    url: '/repair/notPassAudit',
    method: 'post',
    params: query
  })
}

/*校外接口 */
// 校外维修列表新增
export function addOut(data) {
  return request({
    url: '/repair/addOut',
    method: 'post',
    data: data
  })
}

//校外编辑回显
export function getRepairOut(id) {
  return request({
    url: '/repair/getInfoForUpdateOut/' + id,
    method: 'get',
  })
}

// 校外维修列表编辑
export function updateRepairOut(data) {
  return request({
    url: '/repair/updateOut',
    method: 'put',
    data: data
  })
}
