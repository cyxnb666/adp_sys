import request from '@/utils/request'

// /mailbox/query 查询邮箱模板列表
export function getMailboxQuery(data) {
  return request({
    url: '/mailbox/query/' + data,
    method: 'get'
  })
}

// /mailbox/save 操作邮箱模板
export function mailboxSave(data) {
  return request({
    url: '/mailbox/save',
    method: 'post',
    data
  })
}
