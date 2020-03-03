<template>
  <b-row class="h-100">
    <b-colxx xxs="12" md="10" class="mx-auto my-auto">
      <b-card class="auth-card" no-body>
        <div class="position-relative image-side cook">
          <p class=" text-white h2">
            {{ $t("dashboards.magic-is-in-the-details") }}
          </p>
        </div>
        <div class="form-side">
          <router-link tag="a" to="/">
            <b-img
              class="d-xs-block mb-5 mx-auto"
              :src="logo"
              height="60px"
              alt="Responsive image"
            ></b-img>
          </router-link>
          <template v-if="formSent === false">
            <h6 class="mb-4">{{ $t("user.register") }}</h6>
            <b-form @submit.prevent="formSubmit">
              <label class="form-group has-float-label mb-4">
                <input
                  type="text"
                  class="form-control"
                  v-model="fullname"
                  required
                />
                <span>{{ $t("user.fullname") }}</span>
              </label>
              <label class="form-group has-float-label mb-4">
                <input
                  type="email"
                  trim
                  class="form-control"
                  v-model="email"
                  required
                />
                <span>{{ $t("user.email") }}</span>
              </label>

              <!-- <label class="form-group has-float-label mb-4">
                <b-form-input
                  type="phone"
                  trim
                  class="form-control"
                  v-model="phoneNumber"
                  required
                />
                <span>Telefono</span>
              </label> -->

              <label class="form-group has-float-label mb-4">
                <b-form-input
                  :type="type"
                  :state="valid"
                  class="form-control"
                  v-model="password"
                  required
                />
                <span>{{ $t("user.password") }}</span>
              </label>
              <label class="form-group has-float-label mb-4">
                <b-form-input
                  id="input-live"
                  :type="type"
                  :state="valid"
                  class="form-control"
                  aria-describedby="input-live-help input-live-feedback"
                  v-model="passwordConfirm"
                  trim
                  required
                />
                <span>{{ $t("user.password-confirm") }}</span>
                <b-form-invalid-feedback id="input-live-feedback">
                  {{ $t("user.password-not-equals") }}
                </b-form-invalid-feedback>
              </label>
              <div class="d-flex justify-content-end align-items-center">
                <b-button
                  v-if="loading === false"
                  type="submit"
                  variant="primary"
                  size="lg"
                  class="btn-shadow"
                >
                  <span>{{ $t("user.register-button") }}</span>
                </b-button>
                <b-spinner
                  v-else
                  variant="primary"
                  type="grow"
                  label="Spinning"
                ></b-spinner>
              </div>
            </b-form>
          </template>
          <div
            v-else-if="formSent === false && errorOcurred"
            class="text-center"
          >
            <h6 class="mb-4">{{ $t("user.register-error") }}</h6>
            <b-btn
              variant="primary"
              to="/user/login"
              class="mx-auto text-center"
            >
              {{ $t("user.verify-email-message") }}
            </b-btn>
          </div>
          <div class="text-center" v-else>
            <h3 class="mb-4">{{ $t("user.register-success-title") }}</h3>
            <!-- <h6 class="mb-4">{{ $t("user.register-success") }}</h6> -->
            <b-btn
              variant="primary"
              to="/user/login"
              class="mx-auto text-center"
            >
              {{ $t("user.verify-email-message") }}
            </b-btn>
          </div>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>

<script>
import axios from "axios";
import { localHost } from "@/constants/config";

export default {
  data() {
    return {
      fullname: "",
      email: "",
      phoneNumber: "+39",
      password: "",
      passwordConfirm: "",
      errorOcurred: false,
      formSent: false,
      loading: false,
      type: "password"
    };
  },
  computed: {
    logo() {
      return this.$store.getters.getTenantInfo.tenant_logo;
    },
    valid() {
      if (this.password.length > 0) {
        if (this.passwordConfirm.length > 0) {
          if (this.password === this.passwordConfirm) {
            return true;
          } else {
            return false;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  },
  methods: {
    async formSubmit() {
      if (this.valid) {
        this.loading = true;
        let formData = new FormData();
        formData.set("name", this.fullname);
        formData.set("email", String(this.email));
        // formData.set('phoneNumber', this.phoneNumber)
        formData.set("password", this.password);
        formData.set("c_password", this.passwordConfirm);

        // formData.set('email', 'aabavaja@aaaa.it')
        // formData.set('password', 'aaaaa')

        // try {
        //   const response = await this.$store.state.axios.post('/api/auth/login', formData)

        //   console.log('user response: ', response)
        //   localStorage.setItem('userToken', response.data.success.token)
        //   commit('SET_AXIOS')

        //   console.log('router', router)
        //   commit('setRedirect', '/')

        //   const { user } = response.data.success
        //   localStorage.setItem('user', JSON.stringify(user))
        //   commit('setUser', user)
        //   router.push('/')
        //   dispatch('getNavigation')
        //   // location.reload()
        // } catch (error) {
        //   console.log(error)
        // }
        try {
          const response = await this.$store.state.axios.post(
            "/api/auth/register",
            formData
          );
          // uid = response.data.uid

          console.log("reponse", response);
        } catch (error) {
          this.loading = false;
          this.errorOcurred = true;
        }

        // const formData2 = new FormData();
        // formData2.set("uid", uid);

        // try {
        //   const response2 = await axios.post(
        //     `https://${hostname}/app/v3/api/?sendEmailVerification`,
        //     formData2,
        //     {
        //       headers: {
        //         "Content-Type": "multipart/form-data"
        //       }
        //     }
        //   );
        //   console.log("reponse2", response2);
        // } catch (error) {
        //   this.loading = false;
        //   this.errorOcurred = true;
        // }

        if (this.errorOcurred === false) {
          this.loading = false;
          this.formSent = true;
        }
      }
    }
  }
};
</script>

<style scoped>
.cook {
  width: 40%;
  background: url(/assets/img/cuocover.jpg) no-repeat top;
  background-size: cover;
  padding: 80px 40px;
}
</style>
