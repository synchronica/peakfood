import axios from 'axios'
import { localHost } from '@/constants/config'

const baseURL = location.hostname === 'localhost' ? `https://${localHost}` : `${location.protocol}//${location.hostname}`
const token = localStorage.getItem('userToken')

let headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'multipart/form-data'
}

export const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: headers
})
