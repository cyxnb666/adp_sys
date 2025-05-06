import store from '@/store'

const title = store.state.settings.adp_config.title || '艾融科技'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
