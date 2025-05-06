// 规则设置的审批状态
import i18n from '@/languages/index'
export function handleStatus(state) {
  let text = ''
  // //   0-待审批，1-一级审核，2-二级审核，3-审核通过,4-退回修改，5-无需审批, 6-审批不通过, 7-试运行删除
  switch (state) {
    case '0':
      text = i18n.t('utils.pending')
      break
    case '1':
      text = i18n.t('utils.one')
      break
    case '2':
      text = i18n.t('utils.two')
      break
    case '3':
      text = i18n.t('approvelDetail.approvalPass')
      break
    case '4':
      text = i18n.t('utils.return')
      break
    case '5':
      text = i18n.t('utils.approval')
      break
    case '6':
      text = i18n.t('utils.noPass')
      break
    case '7':
      text = i18n.t('utils.test')
      break
    default:
      break
  }
  return text
}

export function tableStatus(state) {
  console.groupCollapsed(state)
  let text = ''
  // //   0-待审批，1-一级审核，2-二级审核，3-审核通过,4-退回修改，5-无需审批, 6-审批不通过, 7-试运行删除
  switch (state) {
    case '0':
      text = '待审批'
      break
    case '1':
      text = '一级审批'
      break
    case '2':
      text = '二级审批'
      break
    case '3':
      text = '审批通过'
      break
    case '4':
      text = '退回修改'
      break
    case '5':
      text = '无需审批'
      break
    case '6':
      text = '审批不通过'
      break
    default:
      break
  }
  return text
}

// 规则审批的用户操作状态
export function handleTableStatus(status) {
  // 0-修改，1-新增，2-删除
  if (status === '0') {
    return 'warning'
  }
  if (status === '1') {
    return 'success'
  }
  if (status === '2') {
    return 'danger'
  }
  return ''
}

