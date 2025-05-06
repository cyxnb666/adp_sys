
// 权限管理的审批状态
import i18n from '@/languages/index'
export function handleAuthoritySelf(status) {
  //  审批状态：0-待审批，1-审批通过，2-审批不通过
  if (status === '0') {
    return i18n.t('utils.pending')
  }
  if (status === '1') {
    return i18n.t('utils.approved')
  }
  if (status === '2') {
    return i18n.t('utils.approveFaile')
  }
  return ''
}

export function handleAuthoritySelfPend(status) {
  //  审批状态：0-待审批，1-审批通过，2-审批不通过
  if (status === '0') {
    return '待审批'
  }
  if (status === '1') {
    return '审批通过'
  }
  if (status === '2') {
    return '审批不通过'
  }
  return ''
}
