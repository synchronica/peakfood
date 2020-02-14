import userStore from '@/store/modules/user'

export default (to, from, next) => {
  const currentUser = userStore.state.currentUser ? userStore.state.currentUser : localStorage.getItem('user')

  if (currentUser !== null) {
    next()
  } else {
    localStorage.removeItem('user')
    next('/user/login')
  }
  // firebase.auth().onAuthStateChanged(userData => {
  //   if (userData) {
  //     // User is signed in.
  //     let isLocalHost = location.hostname === 'localhost'
  //     let host = isLocalHost ? localHost : location.hostname

  //     console.log('userStore', userStore)
  //     if (userStore.state.redirect && host === 'peakfood.condivision.cloud') {
  //       next(userStore.state.redirect)
  //       userStore.state.redirect = null
  //     } else if (location.hostname === 'localhost' || location.hostname === 'peakfood.condivision.cloud') {
  //       if (userData.emailVerified) {
  //         next()
  //       } else {
  //         localStorage.removeItem('user')
  //         next('/user/email-not-verified')
  //       }
  //     } else {
  //       next()
  //     }
  //     console.log('userData', userData)
  //   } else {
  //     // No user is signed in.
  //     localStorage.removeItem('user')
  //     next('/user/login')
  //   }
  // })
}
