import request from '@/utils/request'

// 查询维修列表列表
export function costList(query) {
  return request({
    url: '/project/cost/list',
    method: 'get',
    params: query
  })
}

// 新增维修成本维护
export function add(query) {
    return request({
        url: '/project/cost',
        method: 'post',
        data: query
    })
}

// 修改维修成本维护
export function update(data) {
    return request({
      url: '/project/cost',
      method: 'put',
      data: data
    })
}

// 删除维修成本维护
export function del(id) {
    return request({
      url: '/project/cost/' + id,
      method: 'delete'
    })
}

// 修改回显
export function getDetail(id) {
    return request({
      url: '/project/cost/' + id,
      method: 'get',
    })
}