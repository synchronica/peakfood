// import { store } from '../store'
export const defaultMenuType = 'menu-sub-hidden' // 'menu-default', 'menu-sub-hidden', 'menu-hidden';
export const defaultStartPath = '/app/dashboards/default'
export const searchPath = '/app/pages/search'
export const buyUrl = 'https://1.envato.market/nEyZa'

export const subHiddenBreakpoint = 1440
export const menuHiddenBreakpoint = 768

export const defaultLocale = 'it'
export const defaultDirection = 'ltr'
export const localeOptions = [
  { id: 'en', name: 'English LTR', direction: 'ltr' },
  { id: 'es', name: 'Español', direction: 'ltr' },
  { id: 'enrtl', name: 'English RTL', direction: 'rtl' },
  { id: 'it', name: 'Italian', direction: 'ltr' }
]

export const localHost = 'appfood.aryma.it'

export const firebaseConfig = () => {
  let hostname = location.hostname
  if (hostname === 'localhost') {
    hostname = localHost
  }
  if (hostname === 'peakfood.condivision.cloud') {
    console.log('wtf')
    return {
      apiKey: 'AIzaSyABY27KtuDmx18yZoKZipcMdFCwVYJ6j4U',
      authDomain: 'peak-food.firebaseapp.com',
      databaseURL: 'https://peak-food.firebaseio.com',
      projectId: 'peak-food',
      storageBucket: 'peak-food.appspot.com',
      messagingSenderId: '496368237415'
    }
  }
}

export const apiUrl = 'https://api.coloredstrategies.com'

export const currentUser = {
  id: 1,
  title: 'New User',
  img: '#',
  date: 'Ultima visita oggi 15:24'
}

export const defaultColor = localStorage.getItem('themeColor') ? localStorage.getItem('themeColor') : 'light.blue'
export const colors = [
  'light.purple',
  'dark.purple',
  'light.blue',
  'dark.blue',
  'light.green',
  'dark.green',
  'light.orange',
  'dark.orange',
  'light.red',
  'dark.red'
]
