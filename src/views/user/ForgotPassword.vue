<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side ">
          <p class=" text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
          <!-- <p class="white mb-0">Please use your e-mail to reset your password. <br>If you are not a member, please
            <router-link tag="a" to="/user/register" class="white">register</router-link>.
          </p> -->
        </div>
        <div v-if="emailSent === false" class="form-side">
          <router-link tag="a" to="/">
            <b-img class="d-xs-block mb-5 mx-auto" :src="logo" height="60px" alt="Responsive image"></b-img>
          </router-link>
          <h6 class="mb-4">{{ $t('user.forgot-password')}}</h6>
          <b-form @submit.prevent="formSubmit">
            <label class="form-group has-float-label mb-4">
              <input type="email" class="form-control" v-model="email" required>
              <span>{{ $t('user.email') }}</span>
            </label>
            <div class="d-flex justify-content-end align-items-center">
              <template v-if="formSent === false">
                <b-btn variant="secondary" to="/user/login" size="md" class="mr-2 btn-shadow">
                  {{ $t('user.verify-email-message') }}
                </b-btn>
                <b-button type="submit" variant="primary" size="md" class="btn-shadow">
                  {{ $t('user.send-reset-email')}}
                </b-button>
              </template>
              <b-spinner v-else variant="primary" type="grow" label="Spinning"></b-spinner>
            </div>
          </b-form>
        </div>
        <div v-else class="form-side text-center">
          <router-link tag="a" to="/">
            <b-img class="d-xs-block mb-5 mx-auto" :src="logo" height="60px" alt="Responsive image"></b-img>
          </router-link>
          <h6 class="mb-4 text-center">{{ $t('user.password-email-sent')}}</h6>
          <b-btn variant="primary" to="/user/login" class="mx-auto text-center">
            {{ $t('user.verify-email-message') }}
          </b-btn>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
export default {
  data () {
    return {
      fullname: '',
      email: '',
      password: '',
      formSent: false
    }
  },
  computed: {
    logo () {
      return this.$store.getters.getTenantInfo.tenant_logo
    },
    emailError () {
      return this.$store.getters['emailError']
    },
    emailSent () {
      return this.$store.state.user.emailSent
    }
  },
  watch: {
    emailError () {
      this.handleNotify(this.emailError)
    },
    emailSent () {
      this.formSent = false
    }
  },
  methods: {
    formSubmit () {
      this.formSent = true
      this.$store.dispatch('sendPasswordResetEmail', this.email)
    },
    handleNotify ({ type, title, message }) {
      this.$notify(type, title, message, { duration: 5000, permanent: false })
    }
  }
}
</script>
