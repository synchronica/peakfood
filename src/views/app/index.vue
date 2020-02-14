<template>
  <div id="app-container" v-show="initIsLoad && errorOcurred === false" :class="getMenuType">
    <top-nav/>
    <sidebar v-if="isMain"/>
    <main :class="{'mx-0' : isMain === false}">
      <div class="container-fluid">
        <router-view v-if="initIsLoad"/>
      </div>
    </main>
  </div>
</template>
<script>
import Sidebar from '@/containers/Sidebar'
import TopNav from '@/containers/TopNav'
import { mapGetters } from 'vuex'

export default {
  data () {
    return { show: false }
  },
  components: {
    TopNav,
    Sidebar
  },
  watch: {
    errorOcurred () {
      const type = 'error filled'
      const title = 'C\'è stato un problema'
      const message = this.errorOcurred.message
      this.$notify(type, title, message, { duration: 3000, permanent: false })
    }
  },
  computed: {
    isMain () {
      if (this.$route.path === '/app/terms' || this.$route.path === '/app/plans') {
        return false
      } else {
        return true
      }
    },
    initIsLoad () {
      return this.$store.getters.getInitIsLoad
    },
    errorOcurred () {
      return this.$store.getters.getError
    },
    ...mapGetters(['getMenuType'])
  }
}
</script>
