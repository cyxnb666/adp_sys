import store from '@/store'
import { getToken } from '@/utils/auth'

getToken() && store.dispatch('app/SET_GETRULEEXPRESSIONSALL')
