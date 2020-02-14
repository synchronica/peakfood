<template>
  <b-row id="login-form" class="h-100 mx-auto">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="rounded px-4 py-4" no-body>
          <div class="form-side text-center">
            <router-link tag="a" to="/">
            <b-img class="d-xs-block mb-5 mx-auto" :src="logo" fluid alt="Responsive image"></b-img>
            </router-link>
            <div v-if="verified === false && error === false" class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Caricando...</strong>
            </div>
            <template v-else-if="verified === true && error === false">
            <h6 class="mb-4 text-center">{{ $t('user.verify-email-title')}}</h6>
            <b-btn variant="primary" to="/user/login" class="mx-auto text-center">{{ $t('user.verify-email-message') }}</b-btn>
            </template>

            <template v-else-if="verified === false && error === true">
            <h6 class="mb-4 text-center">{{ $t('user.verify-email-error')}}</h6>
            <b-btn variant="primary" to="/user/login" class="mx-auto text-center">{{ $t('user.verify-email-message') }}</b-btn>
            </template>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  props: {
    oobCode: String,
    apiKey: String
  },
  data () {
    return {
      verified: false,
      error: false
    }
  },
  computed: {
    logo () {
      return this.$store.getters.getTenantInfo.tenant_logo
    }
  },
  mounted () {
    const { oobCode } = this.$route.query

    firebase.auth().applyActionCode(oobCode)
      .then(response => {
        this.verified = true
      }).catch((error) => {
        this.error = true
        console.log(error)
      })
  }
}
</script>

<style scoped>
@media (min-width: 1200px) {
  #login-form {
    max-width: 500px !important;
  }
}
</style>
