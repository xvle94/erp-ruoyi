import request from '@/utils/request'

const basePath = '/emp/base/materiel';
// 查询物料信息列表
export function listInfo(query) {
  return request({
    url: basePath +'/list',
    method: 'get',
    params: query
  })
}

// 查询物料信息详细
export function getInfo(id) {
  return request({
    url: basePath + '/' + id,
    method: 'get'
  })
}

// 新增物料信息
export function addInfo(data) {
  return request({
    url: basePath,
    method: 'post',
    data: data
  })
}

// 修改物料信息
export function updateInfo(data) {
  return request({
    url: basePath ,
    method: 'put',
    data: data
  })
}

// 删除物料信息
export function delInfo(code) {
  return request({
    url: basePath + '/' + code,
    method: 'delete'
  })
}

// 查询物料下拉树结构
export function treeselect() {
  return request({
    url: basePath +'/tree/select',
    method: 'get'
  })
}

/**验证物料名称是否重复 */
export function checkName(name) {
  return request({
  url: basePath +'/check/' + name,
  method: 'get',
  })

  
  
}

