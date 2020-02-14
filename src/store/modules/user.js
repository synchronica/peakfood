import firebase from 'firebase/app'
import 'firebase/auth'
import axios from 'axios'
import router from '@/router'
import { instance } from '@/axiosInstance'

export default {
  state: {
    currentUser: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
    loginError: null,
    processing: false,
    emailSent: false,
    emailError: '',
    redirect: ''
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError,
    emailError: state => state.emailError

  },
  mutations: {
    setUser (state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout (state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing (state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError (state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    clearError (state) {
      state.loginError = null
    },
    SET_EMAIL_ERROR (state, payload) {
      state.emailError = payload
    },
    SET_EMAIL_SENT (state, payload) {
      state.emailSent = payload
      setTimeout(() => {
        state.emailSent = false
      }, 30000)
    },
    setRedirect (state, redirect) {
      state.redirect = redirect
    }
  },
  actions: {
    async login ({ commit, rootState, dispatch }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      let formData = new FormData()
      // formData.set('email', payload.email)
      // formData.set('password', payload.password)
      formData.set('email', 'aabavaja@aaaa.it')
      formData.set('password', 'aaaaa')

      try {
        const response = await instance.post('/api/auth/login', formData)

        console.log('user response: ', response)
        localStorage.setItem('userToken', response.data.success.token)

        dispatch('getNavigation')
        router.push('/')
        console.log('router', router)
        commit('setRedirect', '/')

        const { user } = response.data.success
        localStorage.setItem('user', JSON.stringify(user))
        commit('setUser', user)
      } catch (error) {
        console.log(error)
      }
    },
    sendPasswordResetEmail ({ commit }, emailAddress) {
      // firebase.auth().languageCode = 'it'
      firebase
        .auth()
        .sendPasswordResetEmail(emailAddress)
        .then(response => {
          // Email sent.
          commit('SET_EMAIL_SENT', true)
          console.log('emailsent', response)
        }).catch(error => {
          // An error happened.
          const notify = {
            type: 'error filled',
            title: 'C\'è stato un problema',
            message: error.message
          }
          commit('SET_EMAIL_ERROR', notify)
          console.log(error)
        })
    },
    signOut ({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem('user')
          commit('setLogout')
        }, _error => {})
    }
  }
}
