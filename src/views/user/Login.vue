<template>
  <b-row id="login-form" class="h-100 mx-auto">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="rounded px-4 py-4" no-body>
          <div class="form-side">
            <router-link tag="a" to="/">
            <!-- <span class="logo-single"/> -->
            <b-img class="d-xs-block mb-5 mx-auto" :src="logo" fluid alt="Responsive image"></b-img>
            </router-link>
            <h6 class="mb-4">{{ $t('user.login-title')}}</h6>
            <b-form @submit.prevent="formSubmit">
              <label class="form-group has-float-label mb-4">
                <input type="email" class="form-control" v-model="email">
                <span>{{ $t('user.email') }}</span>
              </label>
              <label class="form-group has-float-label mb-4">
                <input type="password" class="form-control" v-model="password">
                <span>{{ $t('user.password') }}</span>
              </label>
              <div class="d-flex justify-content-between align-items-center">
                <router-link tag="a" to="/user/register">Registra nuovo utente</router-link>
                  <router-link tag="a" to="/user/forgot-password">{{ $t('user.forgot-password-question')}}</router-link>
                  <b-button v-if="formSent === false" type="submit" variant="primary" size="lg" class="btn-shadow" :disabled="processing">{{ $t('user.login-button')}}</b-button>
                  <b-spinner v-else variant="primary" type="grow" label="Spinning"></b-spinner>

              </div>
          </b-form>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      email: '',
      password: '',
      formSent: false
    }
  },
  computed: {
    logo () {
      return this.$store.getters.getTenantInfo.tenant_logo
    },
    ...mapGetters(['currentUser', 'processing', 'loginError'])
  },
  methods: {
    ...mapActions(['login']),
    formSubmit () {
      this.formSent = true
      this.login({ email: this.email, password: this.password })
    }
  },
  watch: {
    currentUser (val) {
      if (val && val.uid && val.uid.length > 0) {
        setTimeout(() => {
          this.$router.push('/')
          // this.formSent = false
        }, 500)
      }
    },
    loginError (val) {
      if (val != null) {
        this.formSent = false
        this.$notify('error filled', 'Login Error', val, { duration: 3000, permanent: false })
      }
    }
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
