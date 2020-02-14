<template>
  <div id="user-actions" class="h-100 mx-auto">
    <ResetPassword v-if="mode === 'resetPassword'" :oobCode="oobCode" :apiKey="apiKey"/>
    <VerifyEmail v-else-if="mode === 'verifyEmail'" :oobCode="oobCode" :apiKey="apiKey"/>
  </div>
</template>
<script>
import VerifyEmail from './VerifyEmail'
import ResetPassword from './ResetPassword'

export default {
  components: {
    VerifyEmail,
    ResetPassword
  },
  data () {
    return {
      verified: false,
      error: false
    }
  },
  computed: {
    mode () {
      return this.$route.query.mode
    },
    oobCode () {
      return this.$route.query.oobCode
    },
    apiKey () {
      return this.$route.query.apiKey
    }
  }
  // methods: {

  //   handleRecoverEmail (auth, actionCode, lang) {},
  //   handleVerifyEmail (auth, actionCode, continueUrl, lang) {}
  // }
  // mounted () {
  //   const { oobCode } = this.$route.query

  // switch (this.mode) {
  //   case 'resetPassword':
  //     // Display reset password handler and UI.
  //     handleResetPassword(auth, actionCode, continueUrl, lang);
  //     break;
  //   case 'recoverEmail':
  //     // Display email recovery handler and UI.
  //     handleRecoverEmail(auth, actionCode, lang);
  //     break;
  //   case 'verifyEmail':
  //     // Display email verification handler and UI.
  //     handleVerifyEmail(auth, actionCode, continueUrl, lang);
  //     break;
  //   default:
  //     // Error: invalid mode.
  // }

  // firebase.auth().applyActionCode(oobCode)
  //   .then(response => {
  //     this.verified = true
  //   }).catch((error) => {
  //     this.error = true
  //     console.log(error)
  //   })
  // }
}
</script>

<style scoped>
@media (min-width: 1200px) {
  #login-form {
    max-width: 500px !important;
  }
}
</style>
