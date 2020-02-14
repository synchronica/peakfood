<template>
  <b-row id="login-form" class="h-100 mx-auto">
    <b-colxx xxs="12" md=10  class="mx-auto my-auto">
      <b-card class="rounded px-4 py-4" no-body>
          <div class="form-side text-center">
            <router-link tag="a" to="/">
            <b-img class="d-xs-block mb-5 mx-auto" :src="logo" fluid alt="Responsive image"></b-img>
            </router-link>
            <h6 class="mb-4 text-center">{{ $t('user.email-not-verified')}}</h6>
            <b-btn variant="primary" to="/user/login" class="mx-auto text-center">{{ $t('user.verify-email-message') }}</b-btn>
        </div>
      </b-card>
    </b-colxx>
  </b-row>
</template>
<script>
export default {
  computed: {
    logo () {
      return this.$store.getters.getTenantInfo.tenant_logo
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
