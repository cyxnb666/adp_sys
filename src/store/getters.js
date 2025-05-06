const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  user: state => state.user,
  permission_routes: state => state.permission.sidebar,
  routes: state => state.permission.routes,
  applicationList: state => state.app.applicationList,
  bom: state => state.bom,
  settings: state => state.settings,
  lang: state => state.settings.lang
}
export default getters
