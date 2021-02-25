import request from '@/utils/request'

// 查询维修任务列表列表
export function getSourceList(query) {
  return request({
    url: '/repair/sourcelist',
    method: 'get',
    params: query
  })
}

// 导出维修溯源列表
export function exportRepair(query) {
  return request({
    url: '/repair/sourcelistExport',
    method: 'get',
    params: query
  })
}

// 同意换配件
export function passSource(data) {
  return request({
      url: '/repair/passSource',
      method: 'post',
      params: data
  })
}

// 不同意换配件
export function notPassSource(data) {
  return request({
      url: '/repair/notPassSource',
      method: 'post',
      params: data
  })
}