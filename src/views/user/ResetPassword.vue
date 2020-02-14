<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side ">
          <p class=" text-white h2">{{ $t('dashboards.magic-is-in-the-details') }}</p>
        </div>
        <div v-if="isReset === false" class="form-side">
          <router-link tag="a" to="/">
          <!-- <span class="logo-single"/> -->
          <b-img class="d-xs-block mb-5 mx-auto" :src="logo" height="60px" alt="Responsive image"></b-img>
          </router-link>
          <h6 class="mb-4">{{ $t('user.reset-password')}}</h6>
          <b-form @submit.prevent="handleResetPassword" :validated="valid">
            <label class="form-group has-float-label mb-4">
              <b-form-input
                :type="type"
                :state="valid"
                class="form-control"
                v-model="password"
                required
              />
              <span>{{ $t('user.password') }}</span>
            </label>
            <label class="form-group has-float-label mb-4">
              <b-form-input
                id="input-live"
                autofocus
                :type="type"
                :state="valid"
                class="form-control"
                aria-describedby="input-live-help input-live-feedback"
                v-model="passwordConfirm"
                trim
                required
              />
              <span>{{ $t('user.password-confirm') }}</span>
              <b-form-invalid-feedback id="input-live-feedback">
                {{ $t('user.password-not-equals') }}
              </b-form-invalid-feedback>
            </label>
            <div class="d-flex justify-content-end align-items-center">
              <template v-if="formSent === false">
                <b-button
                  type="button"
                  variant="secondary"
                  size="lg"
                  class="btn-shadow mr-2"
                  @click="toggleType"
                >{{ $t('user.show-password')}}</b-button>
                <b-button type="submit" variant="primary" size="lg" class="btn-shadow">
                  {{ $t('user.reset-password-button')}}
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
          <h6 class="mb-4">{{ $t('user.password-has-been-reset')}}</h6>
          <b-btn variant="primary" to="/user/login" class="mx-auto text-center">
            {{ $t('user.verify-email-message') }}
          </b-btn>
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
      password: '',
      passwordConfirm: '',
      type: 'password',
      isReset: false,
      formSent: false
    }
  },
  computed: {
    logo () {
      return this.$store.getters.getTenantInfo.tenant_logo
    },
    actionCode () {
      return this.$route.query.oobCode
    },
    valid () {
      if (this.password.length > 0) {
        if (this.passwordConfirm.length > 0) {
          if (this.password === this.passwordConfirm) {
            return true
          } else {
            return false
          }
        } else {
          return null
        }
      } else {
        return null
      }
    }
  },
  methods: {
    toggleType () {
      if (this.type === 'password') {
        this.type = 'text'
      } else {
        this.type = 'password'
      }
    },
    handleResetPassword () {
      this.formSent = true
      // Verify the password reset code is valid.
      firebase.auth().verifyPasswordResetCode(this.oobCode).then(email => {
        const accountEmail = email

        // TODO: Show the reset screen with the user's email and ask the user for
        // the new password.

        // Save the new password.
        firebase.auth().confirmPasswordReset(this.oobCode, this.password).then(resp => {
          this.isReset = true
          this.formSent = false

          // Password reset has been confirmed and new password updated.
          console.log('resp', resp)
          // TODO: Display a link back to the app, or sign-in the user directly
          // if the page belongs to the same domain as the app:
          // auth.signInWithEmailAndPassword(accountEmail, newPassword);

          // TODO: If a continue URL is available, display a button which on
          // click redirects the user back to the app via continueUrl with
          // additional state determined from that URL's parameters.
        }).catch(error => {
          console.log(error)
          // Error occurred during confirmation. The code might have expired or the
          // password is too weak.
        })
      }).catch(error => {
        console.log(error)
        // Invalid or expired action code. Ask user to try to reset the password
        // again.
      })
    },
    // formSubmit () {
    //   this.$store.dispatch('sendPasswordResetEmail', this.email)
    //   console.log('forgot-password')
    //   // this.$router.push('/')
    // },
    handleNotify ({ type, title, message }) {
      this.$notify(type, title, message, { duration: 5000, permanent: false })
    }
  }
}
</script>
